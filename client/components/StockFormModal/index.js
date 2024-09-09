import React from 'react';
import { Flex, TextInput, Button, Modal } from '@mantine/core';
import { useForm } from '@mantine/form';

export function StockFormModal(props) {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: props.currentStock,
    validate: {
      name: (value) => (value ? null : 'Please enter a company name'),
      symbol: (value) => (value ? null : 'Please enter a symbol'),
      location: (value) => (value ? null : 'Please enter a location'),
    }
  });

  return (
    <Modal title={props.currentStock?.id ? 'Edit Stock' : 'Add Stock'} size="md" padding="md" opened={props.currentStock} onClose={props.onClose}>
      <form onSubmit={form.onSubmit(props.onSubmit)}>
        <Flex direction="column" gap="md">
          <TextInput label="Company Name" placeholder="i.e. Apple" key={form.key('name')} {...form.getInputProps('name')} />
          <TextInput label="Symbol" placeholder="i.e. AAPL" key={form.key('symbol')} {...form.getInputProps('symbol')} />
          <TextInput label="Location" placeholder="i.e. California" key={form.key('location')} {...form.getInputProps('location')} />
          <Button variant="light" type="submit">Save</Button>
        </Flex>
      </form>
    </Modal>
  );
}
