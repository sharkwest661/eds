import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

export const ContactUs = () => {
  return (
    <Box mt="5rem">
      <Heading as="h3" size="lg" textAlign="center" mb="50px">
        Bizimlə əlaqə
      </Heading>
      <Flex justifyContent="center" gap="3rem"></Flex>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3039.1232717658877!2d49.85517620802229!3d40.383960434502946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2saz!4v1727617085627!5m2!1sen!2saz"
        width="100%"
        height="470"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </Box>
  );
};
