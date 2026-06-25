import { useState } from 'react';
import { useRouter } from 'next/router';
import { addTrip } from '../src/lib/store';
import LandingPage from '../src/components/LandingPage';
import CreateTripModal from '../src/components/CreateTripModal';
import styles from '../styles/tripplan.module.css';

export default function LpPage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  async function handleCreate(input: { cover: string; title: string; destination: string; startDate: string; endDate: string; passwordHash?: string }) {
    const trip = addTrip(input);
    router.push(`/trips/${trip.id}`);
  }

  return (
    <div className={styles.app}>
      <LandingPage onStart={() => setShowModal(true)} />
      {showModal && <CreateTripModal onClose={() => setShowModal(false)} onCreate={handleCreate} />}
    </div>
  );
}
