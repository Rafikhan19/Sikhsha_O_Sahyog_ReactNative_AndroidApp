

import { View, Text, StyleSheet, ScrollView, Button, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { Entypo } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'

const StudentSubmissions = ({ route }) => {
    const { formStructureId } = route.params;
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await axios.get(`http://192.168.125.159:8000/responses/${formStructureId}`);
                setResponses(response.data.responses);
            } catch (error) {
                console.error('Error fetching responses:', error);
            }
        };

        fetchResponses();
    }, [formStructureId]);

    const generatePDF = async () => {
        const htmlContent = generateHTMLContent();
        const file = await printToFileAsync({
            html: htmlContent,
            base64: false
        });
        
        await shareAsync(file.uri);
    };

    const generateHTMLContent = () => {
        let html = `
            <html>
                <body>
                    <h1>${formStructureId}</h1>
                    <table border="1">
                        <tr>
                            <th>Email</th>
                            <th>Registration No</th>
                            <th>Section</th>
                            <th>Serial No</th>
                            <th>Answers</th>
                        </tr>`;

        responses.forEach(response => {
            html += `
                        <tr>
                            <td>${response.emailId}</td>
                            <td>${response.registrationNumber}</td>
                            <td>${response.section}</td>
                            <td>${response.serialNumber}</td>
                            <td>
                                <ul>`;

            response.answers.forEach(answer => {
                html += `<li>Q${answer.questionNo}: ${answer.value}</li>`;
            });

            html += `
                                </ul>
                            </td>
                        </tr>`;
        });

        html += `
                    </table>
                </body>
            </html>`;

        return html;
    };

    return (
        <View style={styles.container}>
        
        <View style={styles.buttonContainer}>
        <Text style={styles.buttonContainerText}>Student Responses</Text>
        <Pressable style={{fontWeight:"bold"}} onPress={generatePDF} ><Entypo name="share" size={30} color="white" /></Pressable>
        </View>
        <ScrollView horizontal={true} contentContainerStyle={styles.scrollView}>
        
            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Email</Text>
                </View>
                {responses.map((response, index) => (
                    <View key={index}>
                        <View style={styles.row}>
                            <Text style={styles.rowText}>{response.emailId}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>
            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Registration No</Text>
                </View>
                {responses.map((response, index) => (
                    <View key={index}>
                        <View style={styles.row}>
                            <Text style={styles.rowText}>{response.registrationNumber}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>
            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Section</Text>
                </View>
                {responses.map((response, index) => (
                    <View key={index}>
                        <View style={styles.row}>
                            <Text style={styles.rowText}>{response.section}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>
            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Serial No</Text>
                </View>
                {responses.map((response, index) => (
                    <View key={index}>
                        <View style={styles.row}>
                            <Text style={styles.rowText}>{response.serialNumber}</Text>
                        </View>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>
            <View style={styles.container1}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Answers</Text>
                </View>
                {responses.map((response, index) => (
                    <View key={index}>
                        <View style={styles.row}>
                            {response.answers.map((answer, idx) => (
                                <Text key={idx} style={styles.rowText}>{`Q${answer.questionNo}: ${answer.value}`}</Text>
                            ))}
                        </View>
                        <View style={styles.separator} />
                    </View>
                ))}
            </View>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        backgroundColor: "#032030"
    },
    buttonContainer: {
        display:"flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 20,
        paddingTop:10,
        marginBottom: 10,
        
        height:50
    },
    buttonContainerText:{
     fontSize:20,
     fontWeight:"bold",
     paddingLeft:10,
     color:"white",
     letterSpacing:1

    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
    },
    scrollView: {
        flexGrow: 1,
        backgroundColor: "#BAE5F4",
        padding:10

    },
    container1: {
        paddingHorizontal: 10,
        paddingVertical: 0,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    header: {
        marginBottom: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        color:"#032030"

    },
    row: {
        marginBottom: 10,
        borderBottomWidth:0.5,
        borderColor:"#032030",
        borderEndWidth:0.5,
        borderEndColor:"#032030",
        justifyContent:"center",
        alignItems:"center",
        
    },
    rowText: {
        fontSize: 16,
    },
});





export default StudentSubmissions;



