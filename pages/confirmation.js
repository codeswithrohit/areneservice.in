import { useRouter } from 'next/router';

const ConfirmationPage = () => {
  const router = useRouter();
  const { firstName } = router.query;

  return (
    <div className="flex justify-center bg-white items-center h-screen">
      <div className="bg-green-200 border border-green-500 text-green-900 px-4 py-2 rounded-md">
        <p className="text-lg font-semibold">Booking Confirmed!</p>
        {firstName && (
          <p className="mt-2">Thank you, {firstName}, for your booking.</p>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
