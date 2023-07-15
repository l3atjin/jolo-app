import { Button, Input, Modal, Text } from 'native-base';
import React, { ReactNode } from 'react'
import { useUserType } from '../context/UserTypeProvider';
import { RequestResponse } from '../utils/requests';

interface RequestModalProps {
  request: RequestResponse[0] | null;
  handleClose: () => void;
  rideDetails: string;
  setRideDetails: (value: string) => void;
  submitRequest: () => void;
  children: ReactNode;
}

export const RequestModal: React.FC<RequestModalProps> = ({ request, handleClose, rideDetails, setRideDetails, submitRequest, children }) => {
  const [userType] = useUserType();
  return (
    <Modal isOpen={request !== null} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Мэдээлэл</Modal.Header>
        <Modal.Body>
          {/* Display your post details here */}
          <Text>Жолоочийн нэр: {request?.author.first_name}</Text>
          <Text>Хаанаас: {request?.departure_location.location_name}</Text>
          <Text>Хаашаа: {request?.destination_location.location_name}</Text>
          <Text>Өдөр: {request?.departure_day}</Text>
          <Text>Хэзээ: {request?.departure_time ?? request?.time_of_day}</Text>
          { children }
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
}
