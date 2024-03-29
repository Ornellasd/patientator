import React from 'react';
import axios from 'axios';
import { Container, Table, Button, Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { PatientFormValues } from '../AddPatientModal/AddPatientForm';
import AddPatientModal from '../AddPatientModal';
import { Patient } from '../types';
import HealthRatingBar from '../components/HealthRatingBar';
import { useStateValue, addPatient } from '../state';

interface Props {
  isLoading: boolean;
}

const PatientListPage = ({ isLoading }: Props) => {
  const apiBaseUrl: string = process.env.REACT_APP_BACKEND_URL || '';

  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values
      );
      dispatch(addPatient(newPatient));
      closeModal();
    } catch (e) {
      // @ts-expect-error error unknown
      console.error(e.response?.data || 'Unknown Error');
      // @ts-expect-error error unknown
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  if (isLoading) {
    return (
      <Loader active inline="centered" />
    );
  }

  return (
    <div className="App">
      <Container textAlign="center">
        <h3>Patient list</h3>
      </Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
            <Table.HeaderCell>Occupation</Table.HeaderCell>
            <Table.HeaderCell>Health Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(patients).map((patient: Patient) => (
            <Table.Row key={patient.id}>
              <Table.Cell>
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </Table.Cell>
              <Table.Cell>{patient.gender}</Table.Cell>
              <Table.Cell>{patient.occupation}</Table.Cell>
              <Table.Cell>
                <HealthRatingBar showText={false} rating={1} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <AddPatientModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Patient</Button>
    </div>
  );
};

export default PatientListPage;
