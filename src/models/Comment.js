class Comment {
  static comment(data) {
    return {
      dateCreated: data.date_created,
      id: data.id,
      userId: data.user_id,
      comment: data.comment,
      image: data.image,
      status: data.status,
    };
  }
}

export default Comment;
