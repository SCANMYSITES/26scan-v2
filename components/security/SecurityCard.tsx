interface SecurityCardProps {
  title: string;
  data: any;
}

export default function SecurityCard({ title, data }: SecurityCardProps) {
  return (
    <div className="border rounded p-4 bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
