import {
  whatIsPaceContent,
  paceFromTimeContent,
  timeFromPaceContent,
  distanceFromPaceContent,
  splitsContent,
  negativeSplitContent,
  splitStrategiesContent,
  paceTableContent,
} from "./guideContent";

// ─── Generic Section ──────────────────────────────────────────────────────────

type GuideSectionContent = {
  headline: string;
  subheadline: string;
  par1: string;
  par2: string;
  par3: string;
};

function GuideSection({
  content,
  id,
}: {
  content: GuideSectionContent;
  id: string;
}) {
  return (
    <div id={id} className="flex flex-col gap-4">
      <div>
        <h2 className="text-slate-400 text-lg">{content.headline}</h2>
        <p className="text-slate-600 text-sm">{content.subheadline}</p>
      </div>
      <div className="flex flex-col gap-3 text-slate-400 leading-6 text-md">
        <p>{content.par1}</p>
        <p>{content.par2}</p>
        <p>{content.par3}</p>
      </div>
    </div>
  );
}

// ─── Pace Reference Table ─────────────────────────────────────────────────────

type PaceTableContent = {
  headline: string;
  subheadline: string;
  description: string;
  rows: {
    pace: string;
    km5: string;
    km10: string;
    half: string;
    marathon: string;
  }[];
};

function PaceTable({ content }: { content: PaceTableContent }) {
  return (
    <div id="pace-tabelle" className="flex flex-col gap-4">
      <div>
        <h2 className="text-slate-400 text-lg">{content.headline}</h2>
        <p className="text-slate-600 text-sm">{content.subheadline}</p>
      </div>
      <p className="text-slate-400 leading-6 text-md">{content.description}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-slate-400 border-collapse">
          <thead>
            <tr className="text-slate-600 border-b border-slate-700">
              <th className="text-left py-2 pr-2 sm:pr-4 font-normal">Pace</th>
              <th className="text-right py-2 px-2 sm:px-4 font-normal">5 km</th>
              <th className="text-right py-2 px-2 sm:px-4 font-normal">
                10 km
              </th>
              <th className="text-right py-2 px-2 sm:px-4 font-normal">
                <span className="sm:hidden">HM</span>
                <span className="hidden sm:inline">Halbmarathon</span>
              </th>
              <th className="text-right py-2 pl-2 sm:pl-4 font-normal">
                Marathon
              </th>
            </tr>
          </thead>
          <tbody>
            {content.rows.map((row) => (
              <tr
                key={row.pace}
                className="border-b border-slate-800 hover:text-slate-300 transition-colors"
              >
                <td className="py-2 pr-2 sm:pr-4 text-yellow-400">
                  {row.pace}
                </td>
                <td className="py-2 px-2 sm:px-4 text-right">{row.km5}</td>
                <td className="py-2 px-2 sm:px-4 text-right">{row.km10}</td>
                <td className="py-2 px-2 sm:px-4 text-right">{row.half}</td>
                <td className="py-2 pl-2 sm:pl-4 text-right">{row.marathon}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-slate-800" />;
}

// ─── Sections config ──────────────────────────────────────────────────────────

const sections = [
  { content: whatIsPaceContent, id: "was-ist-pace" },
  { content: paceFromTimeContent, id: "pace-berechnen" },
  { content: timeFromPaceContent, id: "zielzeit-berechnen" },
  { content: distanceFromPaceContent, id: "distanz-berechnen" },
  { content: splitsContent, id: "splits" },
  { content: negativeSplitContent, id: "negative-split" },
  { content: splitStrategiesContent, id: "split-strategien" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Guide() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-slate-500 text-left text-xl">
        Lauftempo verstehen – Die Grundlagen
      </h1>

      {sections.map(({ content, id }) => (
        <div key={id} className="flex flex-col gap-6 mt-4">
          <GuideSection content={content} id={id} />
          <Divider />
        </div>
      ))}

      <PaceTable content={paceTableContent} />

      <div className="mt-8 flex justify-center">
        <a
          href="/"
          className="flex flex-col h-full justify-center items-center bg-yellow-400 rounded-lg cursor-pointer p-2"
        >
          Zur Pace-Rechner App
        </a>
      </div>
    </div>
  );
}
