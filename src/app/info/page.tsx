import { ScaleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default async function Info() {
  return (
    <div className="flex flex-col max-w-2xl gap-6">
      <h1 className="text-slate-500 text-left text-xl">
        Pace Planer &ndash; Laufzeiten intuitiv planen
      </h1>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <p>
          Als passionierter Läufer kenne ich die Herausforderungen, die viele
          von uns beim Versuch erleben, ihre Laufzeiten und Paces zu berechnen.
          Zu oft müssen wir uns durch unzählige Cookie-Banner und Werbeanzeigen
          kämpfen, um einfache Informationen zu erhalten. Deshalb habe ich
          &quot;Pace Planer&quot; entwickelt &ndash; eine App, die kostenlos,
          einfach zu bedienen, werbefrei und barrierefrei ist.
        </p>
        <p>
          <b>Einfachheit steht im Vordergrund:</b> &quot;Pace Planer&quot;
          bietet ein klares und intuitives User Interface, das es ermöglicht,
          Zielzeiten sowohl für Standardrenndistanzen als auch für individuelle
          Strecken einfach zu berechnen. Gib deine Pace ein und die App
          berechnet die Zeit, die du benötigst, um deine gewünschte Distanz zu
          absolvieren.
        </p>
        <p>
          <b>Für die Community:</b> Diese App ist vollkommen kostenlos und dient
          als Werkzeug für die gesamte Lauf-Community. Zukünftige Updates werden
          Funktionen wie die Berechnung der Pace für eine bestimmte Zielzeit,
          eine Startzeitplanung zur Koordination mit Freunden und Familie sowie
          die Darstellung verschiedener Rennstrategien, einschließlich des
          Negative Splits, umfassen.
        </p>
        <p>
          <b>Vision für die Zukunft:</b> Ich glaube fest daran, dass jeder
          Zugang zu einfachen, effektiven Tools haben sollte, die das Laufen
          angenehmer machen. Mit &quot;Pace Planer&quot; möchte ich jedem Läufer
          und jeder Läuferin helfen, ihre Ziele zu erreichen und ihre Leistungen
          ohne unnötige Hürden zu planen.
        </p>
        <p>
          <b>Engagement für Datenschutz:</b> Bei der Entwicklung von &quot;Pace
          Planer&quot; war es mir besonders wichtig, eine Umgebung zu schaffen,
          die nicht nur benutzerfreundlich, sondern auch respektvoll gegenüber
          deiner Privatsphäre ist. Deshalb verzichtet die App konsequent auf
          Cookies und Analytics. Dein Training und deine Daten gehören dir
          allein, ohne dass sie von mir oder Drittanbietern verfolgt oder
          analysiert werden. Um diese Seite für alle Läufer:innen kostenlos
          zugänglich zu machen, nutze ich nur die Google Search Console zur
          Indexierung in den Google-Suchergebnissen. Es werden dabei keine
          personenbezogenen Daten gesammelt. Dieses Engagement für Datenschutz
          stellt sicher, dass du die App in vollem Vertrauen nutzen kannst, ohne
          dir Sorgen über ungewollte Datensammlungen machen zu müssen.
        </p>
        <p>
          <ScaleIcon className="h-5 w-5 text-slate-600 inline" />{" "}
          <Link className="text-slate-600" href="/impressum">
            {" "}
            Zum Impressum
          </Link>
        </p>
      </div>
    </div>
  );
}
