import React from "react";
import { PostResponse } from "../utils/requests";
import { Button, Modal, Text } from "native-base";
import { useUserType } from "../context/UserTypeProvider";

interface PostModalProps {
  post: PostResponse[0] | null;
  handleClose: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, handleClose }) => {
  const [userType] = useUserType();
  return (
    <Modal isOpen={post !== null} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Мэдээлэл</Modal.Header>
        <Modal.Body>
          {/* Display your post details here */}
          <Text>Жолоочийн нэр: {post?.author.first_name}</Text>
          <Text>Хаанаас: {post?.departure_location.location_name}</Text>
          <Text>Хаашаа: {post?.destination_location.location_name}</Text>
          <Text>Өдөр: {post?.departure_day}</Text>
          <Text>Хэзээ: {post?.departure_time ?? post?.time_of_day}</Text>
          <Text>Суудлын тоо: {post?.available_seats}</Text>
          <Text>Төлбөр: {post?.fee}</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={handleClose}>Close</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
