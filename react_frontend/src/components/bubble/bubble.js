import React from 'react';
import BubbleChart from './bubbleChart.js';
import './bubblestyle.css';
import PropTypes from 'prop-types'
import { UserQueryServiceClient } from '../../proto/userquerysession_grpc_web_pb.js'
import { TopicRequest } from '../../proto/userquerysession_pb'


function Bubble({ prop, onBubbleClick }) {
    const bubbleChartData = Object.entries(prop[0]).map(([label, value]) => ({ label, value: parseInt(value) }));

    const handleBubbleClick = (label) => {
        console.log(`Bubble ${label} is clicked`);
        const topicRequest = new TopicRequest()
        topicRequest.setOid(prop[1])
        console.log("Prop id is: ", prop[1])
        topicRequest.setTopic(label)
        // Scroll to a new section on the same page when a bubble is clicked
        // Specify the ID of the new section
        const element = document.getElementById('containers');
        if (element) {
            // Smooth scroll to the new section
            element.scrollIntoView({ behavior: 'smooth' });
        }
        try {
            const client = new UserQueryServiceClient('http://127.0.0.1:1337');
            client.sendTopicResponse(topicRequest, {}, (err, response) => {
                console.log("Topic Request went before error");

                if (err) {
                    console.error("gRPC Error: ", err.message);
                    console.error("gRPC Status Code: ", err.code);
                    return;
                }
                console.log("Topic Request went after error");

                const byteMongoData = new Uint8Array(response.array[0]);
                const byteMongoArray = Array.from(byteMongoData);
                const byteMongoString = JSON.stringify(byteMongoArray);
                const byteMongoObject = JSON.parse(byteMongoString);
                const finalJSONString = convertTobase64encoded(byteMongoObject)

                console.log("Received Topic response data:", finalJSONString)
                const dataSet= JSON.parse(finalJSONString).articles;

                console.log("2kDemiGod:", dataSet)
                onBubbleClick(label, dataSet);
            });
        } catch (error) {
            console.error('Client Error:', error.code, error.message);
        }
    }

    function convertTobase64encoded(jsonByteObject) {
        const decoder = new TextDecoder('utf-8');
        const decodedString = decoder.decode(new Uint8Array(jsonByteObject));
        const jsonObject = JSON.parse(decodedString);
        const base64String = JSON.stringify(jsonObject);
        return base64String;
    }

    const handleLegendClick = (label) => {
        console.log(`Legend ${label} is clicked`);
    };

    return (
        <div>
            <BubbleChart
                data={bubbleChartData}
                bubbleClickFun={handleBubbleClick}
                legendClickFun={handleLegendClick}
            
            />
           
        </div>
    );
}

Bubble.propTypes = {
    prop: PropTypes.object.isRequired,
    onBubbleClick: PropTypes.func.isRequired
};

export default Bubble;
