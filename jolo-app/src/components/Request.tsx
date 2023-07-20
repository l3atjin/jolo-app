import { Avatar, Box, HStack, Spacer, Text, VStack } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { RequestResponse } from "../api/types"; // change this to your actual RequestResponse type

interface RequestComponentProps {
  request: RequestResponse[0];
  onClick: (request: RequestResponse[0]) => void;
}

const Request: React.FC<RequestComponentProps> = ({ request, onClick }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onClick(request);
      }}
    >
      <Box bg="white" p="3" rounded="lg" my="2" shadow="2">
        <HStack space={5}>
          <Avatar
            size="lg"
            source={{
              uri: request.author.avatar_url ||
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
            }}
          />
          <VStack alignItems="left">
            <Text fontWeight="bold" fontSize="md">
              {request.author.first_name}
            </Text>
            <Text>
              {request.departure_location.location_name} -{" "}
              {request.destination_location.location_name}
            </Text>
            <Spacer />
            <Text>{request.departure_day}</Text>
            <Text>Time of Day: {request.time_of_day}</Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default Request;
