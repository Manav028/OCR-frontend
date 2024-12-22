import RNFS from 'react-native-fs'
import { GOOGLE_CLOUD_API_KEY,AZURE_ENDPOINT,AZURE_API_KEY , API_URL } from '@env';
import axios from 'axios';
import {Buffer} from 'buffer'
global.Buffer = Buffer  

const speelingCorrectText = async (text: string): Promise<string | null> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/chatgpt/spelling`,
      { text },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const correctedText = response.data.correctedText;
    console.log('Corrected Text:', correctedText);
    return correctedText;
  } catch (error) {
    console.error('Error during spelling correction:', error);
    return null;
  }
};


export const extractTextFromImage = async (imagePath: string): Promise<string | null> => {
  const base64Image = await RNFS.readFile(imagePath,'base64')
  console.log(API_URL)  
  console.log(GOOGLE_CLOUD_API_KEY)
  try {
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [
            {
              type: 'TEXT_DETECTION',
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_API_KEY}`,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const extractedText = response.data.responses[0]?.fullTextAnnotation?.text;
    if (extractedText) {
      console.log('Extracted Text (Image):', extractedText);
      return await speelingCorrectText(extractedText); // Apply spelling correction
    } else {
      console.warn('No text extracted from the image.');
      return null;
    }
  } catch (error) {
    console.error("Error extracting text: ", error);
    return null;
  }
};

export const extractTextFromHandwriting = async (imagePath: string): Promise<string | null> => {
  try {
    console.log('Starting Azure OCR for handwriting...');

    // Step 1: Read the image as a base64 string
    const imageBuffer = await RNFS.readFile(imagePath, 'base64'); // Read the file
    const binaryImage = Buffer.from(imageBuffer, 'base64'); // Convert base64 to binary using Buffer

    // Step 2: Set Azure API headers
    const headers = {
      'Ocp-Apim-Subscription-Key': AZURE_API_KEY, // Azure API Key
      'Content-Type': 'application/octet-stream', // Content type for binary data
    };

    // Step 3: Send the image to Azure's Read API
    const response = await axios.post(
      `${AZURE_ENDPOINT}/vision/v3.2/read/analyze`, // Azure Read API endpoint
      binaryImage,
      { headers }
    );

    // Step 4: Retrieve the operation location for polling the result
    const operationLocation = response.headers['operation-location'];
    if (!operationLocation) {
      console.error('Failed to retrieve operation location from Azure response.');
      return null;
    }

    console.log('Operation Location:', operationLocation);

    // Step 5: Poll the result endpoint until the status is "succeeded"
    let status = 'running';
    let result = null;

    while (status === 'running' || status === 'notStarted') {
      console.log('Polling Azure OCR result...');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds between polls

      const resultResponse = await axios.get(operationLocation, {
        headers: { 'Ocp-Apim-Subscription-Key': AZURE_API_KEY },
      });

      status = resultResponse.data.status; // Update status
      console.log('Current Status:', status);

      if (status === 'succeeded') {
        result = resultResponse.data.analyzeResult.readResults; // Get the result
      }
    }

    // Step 6: Extract the text lines from the result
    if (result) {
      const lines = result
        .flatMap((readResult: any) => 
          readResult.lines.map((line: any) => line.text)
        )
        .join('\n'); // Combine all lines into a single string

      console.log('Extracted Handwritten Text:', lines);
      return lines; // Return the extracted text
    } else {
      console.error('No text found in Azure OCR result.');
      return null;
    }
  } catch (error) {
    console.error('Error during Azure OCR processing:', error);
    return null;
  }
};
