export interface IFriendRecommendation {
    recommendedUserId: string;
    recommendedUsername: string;
    mutualFriendCount: number,
    mutualFriends: string[],
}