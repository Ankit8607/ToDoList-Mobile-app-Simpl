/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useState, Component, useEffect} from 'react';
import {View, Text, StyleSheet, Button, TextInput, SafeAreaView, Alert, TouchableOpacity} from 'react-native';
import {CommonActions, NavigationContainer, useIsFocused} from '@react-navigation/native';
import AsyncStorage  from '@react-native-async-storage/async-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

let lst=[];

const EmptyStateScreen = () => {
  return (
    <View style={styles.empty}>
      <Text>No items to display </Text> 
      <Text style={{marginTop: 10}}>Please press "Add" to add new items</Text>
    </View>
  );
};

function TodoItem({item,handleRemoveItem,navigation,isFocused}){
  const [isClicked, setIsClicked] = useState(false);
  useEffect(()=>{
    isFocused && setIsClicked(false);
  },[isFocused]);
  return(
    <View key={item.id} style={{ marginBottom: 10 }}>
            <TouchableOpacity onPress={()=>setIsClicked(true)}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
              <Text style={{ fontSize: 14 }}>{item.description}</Text>
            </TouchableOpacity>              
            {isClicked && (
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: 'lightcoral', marginRight: 5 }}
                  onPress={() => {setIsClicked(false),handleRemoveItem(item.id)}}>
                  <Text>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: 'lightgreen', marginRight: 5 }}
                  onPress={() => {setIsClicked(false),navigation.navigate('EditTask', { task: item })}}>
                  <Text>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
  );
}

function Home({ navigation }){
  const isFocused=useIsFocused(); 
  const [todoList, setTodoList] = useState([]);

  useEffect(()=>{
    isFocused && loadTodoList();
  },[isFocused]);

  useEffect(() => {
    loadTodoList();
  }, []);

  const loadTodoList = async () => {
    try {
      const savedTodoList = await AsyncStorage.getItem('TodoList');
      if (savedTodoList !== null) {
        setTodoList(JSON.parse(savedTodoList));
        lst=(JSON.parse(savedTodoList));
      }
    } catch (error) {
      console.log('Error loading todo list:', error);
    }
  };

  const saveTodoList = async () => {
    try {
      await AsyncStorage.setItem('TodoList', JSON.stringify(lst));
    } catch (error) {
      console.log('Error saving todo list:', error);
    }
  };

  const handleRemoveItem = (val) => {
    const updatedTodoList = todoList.filter((item) => item.id !== val);
    setTodoList(updatedTodoList);
    lst=updatedTodoList;
    saveTodoList();
    loadTodoList();
  };
  console.log("---- todolist= ",todoList);
  

  return(
    <View style={styles.container}>
      {todoList.length === 0 ? <EmptyStateScreen/> : (
        todoList.map((item) => (
          <TodoItem navigation={navigation} item={item} handleRemoveItem={handleRemoveItem} isFocused={isFocused}/>
        ))
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => { navigation.navigate('ToDoList')}}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>  
    </View>  
  );
}

function ToDoList({ navigation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddTask = async () => {
    // Alert.alert("at handle"+description);
    if (title.trim() != '' && description.trim() != '') {
      try {
        const task = { id: Date.now(), title: title, description: description };
        const existingTasks = await AsyncStorage.getItem('TodoList');
        let taskList = [];

        if (existingTasks !== null) {
          taskList = JSON.parse(existingTasks);
        }
          
        taskList.push(task);
        lst=taskList;
        await AsyncStorage.setItem('TodoList', JSON.stringify(taskList));
        navigation.goBack();

      } catch (error) {
        console.log('Error saving task:', error);
      }
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaView style={{marginTop:140}}>
        <TextInput
          placeholder='Enter Title'
          style={styles.input}
          onChangeText={(text) => setTitle(text)}
          value={title}
        />
        <TextInput
          placeholder='Enter Discription'
          multiline={true}
          numberOfLines={3}
          style={styles.input}
          onChangeText={(text) => setDescription(text)}
          value={description}
        />
      </SafeAreaView>
      <View style={{flex:1, flexDirection: 'row'}}>
        <Button
            title="Confirm"
            onPress={()=>{title!=""?handleAddTask():Alert.alert("Please enter title")}}
          />
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
          />

      </View>
    </View>
  );
}

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleEditTask = async () => {
    if (title.trim() !== '' && description.trim() !== '') {
      try {
        const updatedTask = { id: task.id, title: title, description: description };
        const existingTasks = await AsyncStorage.getItem('TodoList');

        if (existingTasks !== null) {
          let taskList = JSON.parse(existingTasks);
          const index = taskList.findIndex((item) => item.id === task.id);

          if (index !== -1) {
            taskList[index] = updatedTask;
            lst=taskList;
            await AsyncStorage.setItem('TodoList', JSON.stringify(taskList));
            navigation.goBack();
          }
        }
      } catch (error) {
        console.log('Error editing task:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleEditTask}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};


const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{title: 'Welcome'}} />
        <Stack.Screen name="ToDoList" component={ToDoList} />
        <Stack.Screen name="EditTask" component={EditTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles=StyleSheet.create({
  empty:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Button: {
    backgroundColor: '#00aeef',
    borderColor: 'red',
    borderWidth: 5,
    borderRadius: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightblue',
    marginBottom: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightblue',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
})

export default MyStack;