import { Box, HStack, Spacer, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

interface BookingType {
  id: string; // unique id for the booking
  driverName: string; // driver's name
  departure: string; // departure location
  destination: string; // destination location
  date: string; // date of the trip
  timeOfDay: string; // time of day for the trip
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "COMPLETED"; // booking status
}


interface BookingComponentProps {
  booking: BookingType;
  onClick: (booking: BookingType) => void;
}

const Booking: React.FC<BookingComponentProps> = ({ booking, onClick }) => {
  return (
    <TouchableOpacity onPress={() => {onClick(booking)}}>
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={3} alignItems="center">
          <Text fontWeight="bold" fontSize="md">
            {booking.driverName}
          </Text>
          <Text>
            {booking.departure} - {booking.destination}
          </Text>
          <Spacer />
          <Text>{booking.date}</Text>
          <Text>{booking.timeOfDay}</Text>
          <Text>Status: {booking.status}</Text>
        </HStack>
      </Box>
    </TouchableOpacity>
   
  );
};

export default Booking;
