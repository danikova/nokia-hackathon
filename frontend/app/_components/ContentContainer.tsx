import { NextRequest, NextResponse } from 'next/server';

export function getServerSideProps({ req, res }: { req: NextRequest; res: NextResponse }) {
  console.log('asd');
  return { params: { asd: 1 } };
}

export default function ContentContainer({ ...parms }) {
  // return <div>{JSON.stringify(req.pb.authStore.model, null, '  ')}</div>;
  return <div>{JSON.stringify(parms)}</div>;
}
