import mongoose from "mongoose";
import createHttpError from "http-errors";
import { Story } from "../../models/Story.js";
import { User } from "../../models/User.js";
import { Category } from "../../models/Category.js";

const storyProjection = {
  _id: 1,
  img: 1,
  title: 1,
  article: 1,
  category: 1,
  rate: 1,
  ownerId: 1,
  date: 1,
};

const validateStoryId = (storyId) => {
  if (typeof storyId !== "string" || !mongoose.isObjectIdOrHexString(storyId)) {
    throw createHttpError(400, "Invalid story ID");
  }

  return new mongoose.Types.ObjectId(storyId);
};

const parsePositiveInteger = (value, defaultValue) => {
  if (value === undefined) return defaultValue;

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    throw createHttpError(400, "Invalid pagination parameters");
  }

  const number = Number(value);

  if (!Number.isSafeInteger(number)) {
    throw createHttpError(400, "Invalid pagination parameters");
  }

  return number;
};

const getById = async (storyId) => {
  const _id = validateStoryId(storyId);

  const story = await Story.collection.findOne(
    { _id },
    { projection: storyProjection },
  );

  if (!story) {
    throw createHttpError(404, "Story not found");
  }

  const [author, category] = await Promise.all([
    story.ownerId
      ? User.collection.findOne(
          { _id: story.ownerId },
          {
            projection: {
              _id: 1,
              name: 1,
              avatarUrl: 1,
            },
          },
        )
      : Promise.resolve(null),

    story.category
      ? Category.collection.findOne(
          { _id: story.category },
          {
            projection: {
              _id: 1,
              category: 1,
            },
          },
        )
      : Promise.resolve(null),
  ]);

  return {
    ...story,
    author: author
      ? {
          _id: author._id,
          name: author.name,
          avatarUrl: author.avatarUrl ?? null,
        }
      : null,
    category: category
      ? {
          _id: category._id,
          category: category.category,
        }
      : null,
  };
};

const getRecommendations = async (storyId, query = {}) => {
  const _id = validateStoryId(storyId);

  const page = parsePositiveInteger(query.page, 1);
  const limit = parsePositiveInteger(query.limit, 3);
  const skip = (page - 1) * limit;

  if (limit > 50 || !Number.isSafeInteger(skip)) {
    throw createHttpError(400, "Invalid pagination parameters");
  }

  const story = await Story.collection.findOne(
    { _id },
    { projection: { _id: 1, category: 1 } },
  );

  if (!story) {
    throw createHttpError(404, "Story not found");
  }

  if (!story.category) {
    throw createHttpError(500, "Story category is missing");
  }

  const filter = {
    category: story.category,
    _id: { $ne: _id },
  };

  const [items, total] = await Promise.all([
    Story.collection
      .find(filter, { projection: storyProjection })
      .sort({ rate: -1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .toArray(),

    Story.collection.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    hasNextPage: page < Math.ceil(total / limit),
  };
};

export const publicStoriesService = {
  getById,
  getRecommendations,
};
