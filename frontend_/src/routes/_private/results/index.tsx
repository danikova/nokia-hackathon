import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_private/results/')({
  component: Results,
});

function Results() {
  return <div className="p-2">Hello from Results!</div>;
}
