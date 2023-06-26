import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "native-base";
import { Platform, TextInput } from "react-native";

interface OTPFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
}

export default function OTPForm(
  { isOpen, onClose, onSubmit }: OTPFormProps,
) {
  let textInput = useRef<TextInput | null>(null);
  const length = 4;
  const [internalVal, setInternalVal] = useState("");

  const onChangeText = (text: string) => {
    setInternalVal(text);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <Center>
          <Modal.Content>
            <Modal.Header>
              Таны утсанд илгээсэн 4 оронтой кодыг оруулна уу?
            </Modal.Header>
            <Modal.Body>
              <Pressable onPress={() => textInput.current?.focus()}>
                <HStack h="50px">
                  <Box
                    borderColor={"coolGray.200"}
                    borderWidth={1}
                    borderRadius={8}
                    w="20%"
                    mx="auto"
                    _text={{
                      fontSize: "xl",
                      fontWeight: "medium",
                      letterSpacing: "lg",
                      mx: "auto",
                      my: "auto",
                    }}
                  >
                    {internalVal.length >= 1 ? internalVal[0] : ""}
                  </Box>
                  <Box
                    borderColor={"coolGray.200"}
                    borderWidth={1}
                    borderRadius={8}
                    w="20%"
                    mx="auto"
                    _text={{
                      fontSize: "xl",
                      fontWeight: "medium",
                      letterSpacing: "lg",
                      mx: "auto",
                      my: "auto",
                    }}
                  >
                    {internalVal.length >= 2 ? internalVal[1] : ""}
                  </Box>
                  <Box
                    borderColor={"coolGray.200"}
                    borderWidth={1}
                    borderRadius={8}
                    w="20%"
                    mx="auto"
                    _text={{
                      fontSize: "xl",
                      fontWeight: "medium",
                      letterSpacing: "lg",
                      mx: "auto",
                      my: "auto",
                    }}
                  >
                    {internalVal.length >= 3 ? internalVal[2] : ""}
                  </Box>
                  <Box
                    borderColor={"coolGray.200"}
                    borderWidth={1}
                    borderRadius={8}
                    w="20%"
                    mx="auto"
                    _text={{
                      fontSize: "xl",
                      fontWeight: "medium",
                      letterSpacing: "lg",
                      mx: "auto",
                      my: "auto",
                    }}
                  >
                    {internalVal.length == 4 ? internalVal[3] : ""}
                  </Box>
                </HStack>
              </Pressable>
            </Modal.Body>
            <Modal.Footer>
              <Button mx="auto" w="40%" onPress={onClose} bgColor="error.600">
                Цуцлах
              </Button>
              <Button
                mx="auto"
                w="40%"
                onPress={() => onSubmit(internalVal)}
                disabled={internalVal.length != length}
              >
                Шалгах
              </Button>
              <Input
                w="0"
                h="0"
                onChangeText={onChangeText}
                ref={textInput}
                value={internalVal}
                returnKeyType="done"
                keyboardType="numeric"
                maxLength={4}
              />
            </Modal.Footer>
          </Modal.Content>
        </Center>
      </KeyboardAvoidingView>
    </Modal>
  );
}
