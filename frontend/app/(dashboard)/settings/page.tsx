import WorkspaceForm from './WorkspaceForm';

export default async function SettingsHome() {
  return (
    <div className="m-16 max-md:m-8 md:max-w-2xl">
      <h2 className='text-2xl pb-8'>
        Workspace settings
      </h2>
      <WorkspaceForm />
    </div>
  );
}
