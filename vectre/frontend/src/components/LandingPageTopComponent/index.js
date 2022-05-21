import {
    Container,
    Stack,
    Box,
    Heading,
    Text,
    Button
} from '@chakra-ui/react';

import { ReactComponent as UserTickIcon } from '../../assets/icons/user-icon-tick.svg'
import { ReactComponent as PlayCircleIcon } from '../../assets/icons/play-circle.svg'
import LandingPageTopImageGrid from '../LandingPageTopImageGrid'

const LandingPageTopComponent = ({
    ...otherProps
}) => {
    return (
        <Box height={'100vh'}>
            {otherProps.children}
            <Container maxW={'8xl'}>
                <Stack
                    align={'center'}
                    spacing={{ base: 8, md: 10 }}
                    pt={{ base: 12, md: 20 }}
                    direction={{ base: 'column', md: 'row' }}>
                    <Stack flex={1} spacing={{ base: 5, md: 10 }} pr={"50px"}>
                        <Heading
                            fontWeight={600}
                            letterSpacing={'1.5px'}
                            lineHeight={0.8}
                            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}>
                            <Text
                                as={'span'} color={'brand.400'}>
                                Vectre.
                            </Text>
                            <br />
                            <Text as={'span'} color={'brand.400'} fontWeight={'400'} fontSize={'40px'}>
                                a web3 social platform for creators, by creators.
                            </Text>
                        </Heading>
                        <Text color={'sub.500'} fontSize={"22px"}>
                            Connect with your favourite communities, showcase your NFTs, earn community badges and decide the direction for your favourite projects!
                        </Text>
                        <Stack
                            spacing={{ base: 4, sm: 6 }}
                            direction={{ base: 'column', sm: 'row' }}>
                            <Button
                                rounded={'6px'}
                                size={'lg'}
                                fontWeight={700}
                                px={8}
                                py={8}
                                fontSize={'sm'}
                                textColor={'white'}
                                bg={'#3B82F6'}
                                leftIcon={<UserTickIcon h={4} w={4} mr={2} color={'white'} />}
                                boxShadow={'0px 30px 60px rgba(59, 130, 246, 0.25)'}
                                _hover={{ bg: '#5290F5' }}>
                                Join Vectre Now
                            </Button>
                            <Button
                                rounded={'6px'}
                                size={'lg'}
                                fontWeight={700}
                                px={8}
                                py={8}
                                fontSize={'sm'}
                                textColor={'#3B82F6'}
                                bg={'#C6DBFF'}
                                leftIcon={<PlayCircleIcon h={4} w={4} mr={2} color={'#3B82F6'} />}
                                _hover={{ bg: '#DDE9FF' }}>
                                Learn More
                            </Button>
                        </Stack>
                    </Stack>
                    <LandingPageTopImageGrid />
                </Stack>
            </Container>
        </Box>
    );
};

export default LandingPageTopComponent;