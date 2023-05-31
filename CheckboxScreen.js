import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
// import CheckBox from '@react-native-community/checkbox'
// import CheckBox from 'react-native-check-box'
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckboxScreen = (navigation) => {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    loadTodoList();
  }, []);

  const loadTodoList = async () => {
    try {
      const savedTodoList = await AsyncStorage.getItem('TodoList');
      if (savedTodoList !== null) {
        setTodoList(JSON.parse(savedTodoList));
      }
    } catch (error) {
      console.log('Error loading todo list:', error);
    }
  };

  const handleEditItem = (id) => {
    const selectedItem = todoList.find((item) => item.id === id);
    if (selectedItem) {
      setTitle(selectedItem.title);
      setDescription(selectedItem.description);
      handleRemoveItem(id);
    }
  };

  const handleRemoveItem = (id) => {
    const updatedTodoList = todoList.filter((item) => item.id !== id);
    setTodoList(updatedTodoList);
  };

  const [isClicked, setIsClicked] = useState(false);

  return (
      {todoList.map((item) => (
        <View key={item.id} style={{ marginBottom: 10 }}>
          <TouchableOpacity onPress={()=>setIsClicked(true)}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
          <Text style={{ fontSize: 14 }}>{item.description}</Text>
          </TouchableOpacity>
          {isClicked && (
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <TouchableOpacity
              style={{ padding: 5, backgroundColor: 'lightcoral', marginRight: 5 }}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ padding: 5, backgroundColor: 'lightgreen', marginRight: 5 }}
              onPress={() => handleEditItem(item.id)}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
          </View>
          )}
          setIsClicked(false);
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default CheckboxScreen;
