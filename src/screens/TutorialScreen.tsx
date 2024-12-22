import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Colors, FontSizes, fontfamily } from '../styles/Globalcss';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import MainButton from '../components/MainButton';
import CustomStatusBar from '../components/CustomStatusBar';


const { width } = Dimensions.get('window');

const slides = [
    {
        key: '1',
        title: 'Welcome to OCR Master',
        text: 'Extract and summarize text from images effortlessly!',
    },
    {
        key: '2',
        title: 'Streamline Your Workflow',
        text: 'Convert images to text and quickly generate summaries.',
    },
    {
        key: '3',
        title: 'Save and Share',
        text: 'Organize extracted text and share it with ease.',
    },
];

type TutorialScreenProps = NativeStackScreenProps<AuthStackParamList, 'TutorialScreen'>;

const TutorialScreen: React.FC<TutorialScreenProps> = ({ navigation }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrevious = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleGetStarted = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    return (
        <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
        >

            <CustomStatusBar
                backgroundColor={Colors.primarybackground}
                barStyle="dark-content"
                translucent={false}
            />
            <View style={styles.shadowContainer}>

                <View style={styles.shadowView} />

                <View style={styles.boxContainer}>

                    <View style={styles.slide}>
                        <Text style={styles.title}>{slides[currentSlide].title}</Text>
                        <Text style={styles.text}>{slides[currentSlide].text}</Text>
                        {currentSlide === slides.length - 1 && (
                            <MainButton
                                title="Get Started"
                                onPress={handleGetStarted}
                                Style={styles.getstartedbtn}
                            />
                        )}
                    </View>

                    <View style={styles.navigationContainer}>
                        <MainButton
                            disabled={currentSlide === 0}
                            onPress={handlePrevious}
                            title="Previous"
                            Style={styles.halfWidthButton}
                        />
                        <MainButton
                            disabled={currentSlide === slides.length - 1}
                            onPress={handleNext}
                            title="Next"
                            Style={styles.halfWidthButton}
                        />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: Colors.primarybackground,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    shadowContainer: {
        position: 'relative',
        width: width * 0.8,
    },
    shadowView: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 10,
        zIndex: -1,
    },

    boxContainer: {
        backgroundColor: Colors.primarybackground,
        borderWidth: 3,
        borderColor: Colors.secondaryborder,
        overflow: 'hidden',
        zIndex: 1,
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        margin: 20,
        backgroundColor: Colors.primarybackground,
    },
    title: {
        fontSize: FontSizes.large,
        fontFamily: fontfamily.SpaceMonoBold,
        color: Colors.primartext,
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: FontSizes.medium,
        color: Colors.secondarytext,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: fontfamily.SpaceMonoRegular,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
        padding: 20,
    },
    halfWidthButton: {
        width: '48%',
    },
    getstartedbtn: {
        width: '80%',
    },
});

export default TutorialScreen;
