import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { GROQ_API_KEY } from '@env';


const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: GROQ_API_KEY});


const TrainingScreen = () => {
  const [muscleGroup, setMuscleGroup] = useState('');
  const [trainingResponse, setTrainingResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchTraining = async () => {
    setLoading(true);
    try {
      const response = await fetchTraining(muscleGroup);
      setTrainingResponse(response);
    } catch (error) {
      console.error('Erro ao buscar treino:', error);
      setTrainingResponse("Ocorreu um erro ao obter o treino.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training.IA</Text>
      <Text style={styles.description}>Digite o grupo muscular para obter seu treino.</Text>

      <TextInput
        placeholder="Ex: Costas, Peito, Pernas..."
        value={muscleGroup}
        onChangeText={setMuscleGroup}
        style={styles.input}
      />

      <Button
        title="Buscar Treino"
        onPress={handleFetchTraining}
        disabled={loading}
        color="#007BFF"
      />

      {loading && <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />}

      {trainingResponse && (
        <View style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Treino Recomendado:</Text>
          <Text style={styles.responseText}>{trainingResponse}</Text>
        </View>
      )}
    </View>
  );
};

// Função para buscar o treino (mesma lógica de antes)
const fetchTraining = async (muscleGroup) => {
  if (!muscleGroup) {
    console.error("Por favor, forneça um grupo muscular.");
    return;
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          "role": "user",
          "content": "Quero te enviar o treino e você ira responder somente o treino\n"
        },
        {
          "role": "assistant",
          "content": "Entendi!\n\nEnvia o grupo muscular que você quer que eu responda com um treino de dois exercícios."
        },
        {
          role: "user",
          content: `Me forneça dois exercícios para o grupo muscular ${muscleGroup}.`
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false,
      stop: null
    });

    if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
      const firstChoice = chatCompletion.choices[0];
      const responseMessage = firstChoice.message?.content || "Resposta não encontrada.";
      return responseMessage;
    } else {
      return "Erro ao obter o treino.";
    }
  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    return "Erro ao buscar treino. Tente novamente.";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
  responseContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  responseText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
});

export default TrainingScreen;
