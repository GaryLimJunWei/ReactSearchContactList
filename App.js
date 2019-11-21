import React from 'react';
import {
  StyleSheet, Text, View, TextInput,
  SafeAreaView, FlatList, ActivityIndicator
}
  from 'react-native';

import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {


  constructor() {
    super()
    this.state = {
      isLoading: true,
      contacts: []
    };
  }

  // Asking for permission to access the contacts
  loadContact = async () => {
    const permission = await Permissions.askAsync(Permissions.CONTACTS);

    if (permission.status !== 'granted') {
      return
    }

    // Create a constant named data and store the field of contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers,
      Contacts.Fields.Emails]
    });

    console.log(data);
    this.setState({ contacts: data, inMemoryContacts: data, isLoading: false })
  }

  /**
   * This method is invoked immediately after a component is mounted/insert
   * In this case, the contacts. Once the contact is called, this method
   * will be call.
   */
  async componentDidMount() {
    this.setState({ isLoading: true });
    this.loadContact()
  }

  /**
   * This item is the contact getting extracted from the contacts.
   * We are styling and specifying how we are arranging the fields.
   */
  renderItem = ({ item }) => (
    <View style={{ minHeight: 70, padding: 5 }}>
      <Text style={{
        color: '#bada55', fontWeight: 'bold',
        fontSize: 26
      }}>
        {item.firstName + ' '}
        {item.lastName}
      </Text>
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        {item.phoneNumbers[0].digits}
      </Text>
    </View>
  );
/*
      Change all to lowercase then add it inside a variable.
 */
  searchContacts = (value) => {
    const filteredContacts = this.state.inMemoryContacts.filter(
      contact => {
        let contactLowercase = (contact.firstName + ' '
          + contact.lastName).toLowerCase()

        let searchTermLowercase = value.toLowerCase()

        return contactLowercase.indexOf(searchTermLowercase) > -1
      }
    )
    this.setState({ contacts: filteredContacts });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ backgroundColor: '#2f363c' }} />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#dddddd"
          style={{
            backgroundColor: '#2f363c',
            height: 50,
            fontSize: 36,
            padding: 10,
            color: 'white',
            borderBottomWidth: 0.5,
            borderBottomColor: '#7d90a0'
          }}
          onChangeText={(value) => this.searchContacts(value)}
        />
        <View style={{ flex: 1, backgroundColor: '#2f363c' }}>
          {this.state.isLoading ? (
            <View
              style={{
                ...StyleSheet.absoluteFill,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ActivityIndicator size="large" color="#bad555" />
            </View>
          ) : null}

          <FlatList
            data={this.state.contacts}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => (
              <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 50
              }}
              >
                <Text style={{ color: '#bad555' }}>No contacts Found
              </Text>
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
