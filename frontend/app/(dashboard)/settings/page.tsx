import WorkspaceForm from './WorkspaceForm';

export default async function SettingsHome() {
  return (
    <div className="m-16 max-md:m-8 md:max-w-2xl">
      <h1 className="text-lg pb-16">Workspace Settings</h1>
      <WorkspaceForm />
    </div>
  );
}
