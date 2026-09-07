function ProtocolsPage() {
  // Creating an Array to hold the Data for later
  // This is a temporary solution until we have a backend to fetch the data from
  // This is compatible with the database -> JSON format
  const protocols = [
    {
      id: 1,
      title: 'Meeting 01: Grundlagen',
      date: '2024-06-01',
      time: '10:00',
      location: 'H5',
      summary: 'Besprechung der Grundlagen und Einführung in das Projekt',
      atendees: 'Tung Tung, Sahur Melanie, Thomas Straubinger',
      status: 'signed',
    },
    {
      id: 2,
      title: 'Meeting 02: Aufgabenverteilung',
      date: '2024-06-08',
      time: '10:00',
      location: 'H98',
      summary: 'Besprechung der Aufgabenverteilung',
      atendees: 'Tung Tung, Sahur Melanie, Thomas Straubinger',
      status: 'pending',
    }
  ]
  return (
    <main>
      <h1>Meeting Protokoll</h1>
      <p>Hier werden später die Protokolle angezeigt.</p>
    </main>
  )
}

export default ProtocolsPage