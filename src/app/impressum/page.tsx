export default async function Impressum() {
  return (
    <div className="flex flex-col max-w-2xl gap-6">
      <h1 className="text-slate-500 text-left text-xl">Impressum</h1>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <p>
          Kevin Heyland
          <br />
          Herderstraße 31 <br />
          39108 Magdeburg <br />
          Deutschland
        </p>
      </div>
    </div>
  );
}
