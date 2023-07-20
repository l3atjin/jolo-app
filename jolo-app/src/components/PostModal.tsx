import React, { useState } from "react";
import { PostResponse } from "../api/types";
import { Button, Input, Modal, Text } from "native-base";
import { useUserType } from "../context/UserTypeProvider";

interface PostModalProps {
  post: PostResponse[0] | null;
  handleClose: () => void;
  rideDetails: string;
  setRideDetails: (value: string) => void;
  submitRequest: () => void;
}

export const PostModal: React.FC<PostModalProps> = ({ post, handleClose, rideDetails, setRideDetails, submitRequest }) => {
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
          <Input
                placeholder="Enter ride details or ask a question..."
                value={rideDetails}
                onChangeText={setRideDetails}
              />
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={submitRequest}>Явяаа</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
