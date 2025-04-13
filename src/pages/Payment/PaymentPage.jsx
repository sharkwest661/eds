import { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Button,
  VStack,
  HStack,
  Input,
  Heading,
  Text,
  Flex,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CreditCard } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import Cards from "react-credit-cards-2";

const PaymentPage = () => {
  const [cardType, setCardType] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    value,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cardNumber: "",
      fullName: "",
      expirationDate: "",
      securityCode: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Payment Data:", data);
    // Add logic to handle payment submission here
  };

  const inputStyle = {
    backgroundColor: "#F6F8F9",
  };

  const cardNumber = watch("cardNumber");
  const fullName = watch("fullName");
  const expirationDate = watch("expirationDate");
  const securityCode = watch("securityCode");

  return (
    <Box p={8}>
      <Heading
        color="#393939"
        // fontSize={{ base: "24px", sm: "40px", md: "60px" }}
        fontSize="40px"
        mb={8}
      >
        ÖDƏNİŞ DETALLARI
      </Heading>
      <Tabs variant="soft-rounded">
        <TabList mb={9}>
          <Tab>Kredit Kartı</Tab>
          <Tab>Milli Ön</Tab>
          <Tab>Digər vasitə</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex gap={8} direction={{ base: "column", lg: "row" }}>
                {/* Left Side - User Cards */}
                <VStack flex="1" align="stretch" justify="center">
                  <Cards
                    number={cardNumber}
                    expiry={expirationDate}
                    cvc={securityCode}
                    name={fullName}
                    focused={"fullName"}
                  />
                  {/* <Heading size="md" mb={4}>
                    Your Cards
                  </Heading> */}
                  {/* Example of user card design */}
                  {/* <Box p={4} border="1px solid" borderRadius="md">
                    <Text>**** **** **** 1234</Text>
                    <Text>John Doe</Text>
                    <Text>Expires 12/23</Text>
                  </Box>
                  <Box p={4} border="1px solid" borderRadius="md">
                    <Text>**** **** **** 5678</Text>
                    <Text>Jane Smith</Text>
                    <Text>Expires 08/24</Text>
                  </Box> */}
                  {/* <Button variant="outline" colorScheme="blue">
                    + Add New Card
                  </Button> */}
                </VStack>

                {/* Right Side - Payment Form */}
                <VStack flex="1" spacing={8} align="stretch">
                  <FormControl h="75px" isInvalid={errors.cardNumber}>
                    <FormLabel>Credit Card Number</FormLabel>
                    <InputGroup ml={0}>
                      <Input
                        placeholder="1234 5678 9012 3456"
                        {...inputStyle}
                        {...register("cardNumber", {
                          required: "Card number is required",
                          minLength: {
                            value: 16,
                            message: "Card number must be 16 digits",
                          },
                          maxLength: {
                            value: 16,
                            message: "Card number must be 16 digits",
                          },
                        })}
                      />
                      <InputRightElement>
                        {/* {cardType === "visa" && (
                          <Icon as={FaCcVisa} boxSize="6" />
                        )}
                        {cardType === "mastercard" && (
                          <Icon as={FaCcMastercard} boxSize="6" />
                        )} */}
                        <CreditCard />
                      </InputRightElement>
                    </InputGroup>
                    {errors.cardNumber && (
                      <Text color="red.500">{errors.cardNumber.message}</Text>
                    )}
                  </FormControl>

                  <FormControl h="75px" isInvalid={errors.fullName}>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      placeholder="Name on card"
                      {...inputStyle}
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                    />
                    {errors.fullName && (
                      <Text color="red.500">{errors.fullName.message}</Text>
                    )}
                  </FormControl>

                  <HStack spacing={4}>
                    <FormControl h="75px" isInvalid={errors.expirationDate}>
                      <FormLabel>Expiration Date</FormLabel>
                      <Input
                        placeholder="MM/YY"
                        {...inputStyle}
                        {...register("expirationDate", {
                          required: "Expiration date is required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                            message: "Invalid expiration date",
                          },
                        })}
                      />
                      {errors.expirationDate && (
                        <Text color="red.500">
                          {errors.expirationDate.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl h="75px" isInvalid={errors.securityCode}>
                      <FormLabel>Security Code</FormLabel>
                      <Input
                        placeholder="CVC"
                        {...inputStyle}
                        {...register("securityCode", {
                          required: "Security code is required",
                          minLength: {
                            value: 3,
                            message: "Security code must be 3 digits",
                          },
                          maxLength: {
                            value: 3,
                            message: "Security code must be 3 digits",
                          },
                        })}
                      />
                      {errors.securityCode && (
                        <Text color="red.500">
                          {errors.securityCode.message}
                        </Text>
                      )}
                    </FormControl>
                  </HStack>

                  <HStack justify="space-between">
                    <Button colorScheme="blue" type="submit">
                      Complete Payment
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </HStack>
                </VStack>
              </Flex>
            </form>
          </TabPanel>

          <TabPanel>
            <Text>Coming soon...</Text>
          </TabPanel>

          <TabPanel>
            <Text>Coming soon...</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default PaymentPage;
