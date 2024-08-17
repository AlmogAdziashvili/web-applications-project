import React, { useContext } from 'react';
import { Switch, Flex, Loader, Table } from '@mantine/core';
import axios from 'axios';
import { Context } from '../../context';

export function AdminUsers() {
  const currentUser = useContext(Context);
  const [users, setUsers] = React.useState([]);

  React.useEffect(() => {
    axios.get('/users').then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleSwitchChange = (username) => async () => {
    const previousUsers = [...users];
    const updatedUsers = users.map((user) => {
      if (user.username === username) {
        return { ...user, isAdmin: !user.isAdmin };
      }
      return user;
    });
    setUsers(updatedUsers);

    const user = updatedUsers.find((user) => user.username === username);

    try {
      await axios.put(`/users/${username}`, { isAdmin: user.isAdmin });
    } catch (error) {
      setUsers(previousUsers);
      return;
    }
  };

  const rows = React.useMemo(() => {
    return users.map((user, index) => (
      <Table.Tr key={user.username}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{user.name}</Table.Td>
        <Table.Td>{user.username}</Table.Td>
        <Table.Td><Switch checked={user.isAdmin} onChange={handleSwitchChange(user.username)} disabled={currentUser?.id === user.id} /></Table.Td>
      </Table.Tr>
    ));
  }, [users, currentUser]);

  if (!users.length || !currentUser) {
    return (
      <Flex justify='center' align='center' flex={1}>
        <Loader size={48} />
      </Flex>
    );
  }

  return (
    <Flex flex={1}>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>#</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Username</Table.Th>
            <Table.Th>Is Admin</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </Flex>
  );
}
