import React from "react";
import { Box, Text, VStack, Button } from "native-base";

interface BookingComponentProps {
  booking: any; // replace with your BookingType when it's ready
  onAccept: (booking: any) => void; // replace any with your BookingType when it's ready
  onReject: (booking: any) => void; // replace any with your BookingType when it's ready
  isPending: boolean;
}

const Booking: React.FC<BookingComponentProps> = ({ booking, onAccept, onReject, isPending }) => {
  const handleAccept = () => {
    onAccept(booking);
  };

  const handleReject = () => {
    onReject(booking);
  };

  return (
    <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
      <VStack space={3} alignItems="flex-start">
        <Text>{booking.post_id.departure_day} at {booking.post_id.time_of_day}</Text>
        <Text>From: {booking.post_id.departure_location_id.location_name}</Text>
        <Text>To: {booking.post_id.destination_location_id.location_name}</Text>
        <Text>Driver: {booking.driver_id.first_name}</Text>
        <Text>Rider: {booking.rider_id.first_name}</Text>
        <Text>{booking.message}</Text>
        <Box flexDirection="row">
          {isPending && (
            <>
              <Button onPress={() => onAccept(booking)}>Accept</Button>
              <Button onPress={() => onReject(booking)}>Reject</Button>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Booking;
