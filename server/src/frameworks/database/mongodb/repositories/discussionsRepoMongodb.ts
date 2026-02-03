import mongoose from 'mongoose';
import Discussions from '../models/discussions';
import { AddDiscussionInterface } from '@src/types/discussion';
import Customers from '../models/customer';
export const discussionRepositoryMongoDb = () => {
  const addDiscussion = async (discussion: AddDiscussionInterface) => {
    const newDiscussion = new Discussions(discussion);
    await newDiscussion.save();
  };

  const getDiscussionsByLesson = async (itemId: string) => {
    const discussionsWithUserDetails = await Discussions.aggregate([
      {
        $match: { itemId: new mongoose.Types.ObjectId(itemId) }
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      {
        $unwind: '$customerDetails'
      },
      {
        $project: {
          _id: 1,
          message: 1,
          itemId: 1,
          replies: 1,
          createdAt: 1,
          updatedAt: 1,
          'customerDetails._id': 1,
          'customerDetails.firstName': 1,
          'customerDetails.lastName': 1,
          'customerDetails.profilePic': 1,
          'customerDetails.dateJoined': 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    return discussionsWithUserDetails;
  };

  const editDiscussion = async (id: string, message: string) => {
    await Discussions.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { message, updatedAt: Date.now() }
    );
  };

  const deleteDiscussionById = async (id: string) => {
    await Discussions.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
  };

  const replyDiscussion = async (
    id: string,
    reply: { customerId: string; message: string }
  ) => {
    await Discussions.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $push: { replies: reply } }
    );
  };

  const getRepliesByDiscussionId = async (id: string) => {
    const result = await Discussions.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) }
      },
      {
        $project: {
          replies: 1
        }
      },
      {
        $unwind: '$replies'
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'replies.customerId',
          foreignField: '_id',
          as: 'repliesWithCustomer'
        }
      },
      {
        $unwind: '$repliesWithCustomer'
      },
      {
        $group: {
          _id: '$_id',
          replies: {
            $push: {
              _id: '$replies._id',
              message: '$replies.message',
              createdAt: '$replies.createdAt',
              updatedAt: '$replies.updatedAt',
              customerDetails: '$repliesWithCustomer'
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          'replies._id': 1,
          'replies.message': 1,
          'replies.createdAt': 1,
          'replies.updatedAt': 1,
          'replies.customerDetails._id': 1,
          'replies.customerDetails.firstName': 1,
          'replies.customerDetails.lastName': 1,
          'replies.customerDetails.dateJoined': 1
        }
      }
    ]);
    const replies = result.length > 0 ? result[0].replies : [];

    return replies;
  };

  return {
    addDiscussion,
    getDiscussionsByLesson,
    editDiscussion,
    deleteDiscussionById,
    replyDiscussion,
    getRepliesByDiscussionId
  };
};

export type DiscussionRepoMongodbInterface = typeof discussionRepositoryMongoDb;
