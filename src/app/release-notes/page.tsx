import { ScaleIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default async function Info() {
  return (
    <div className="flex flex-col max-w-2xl gap-6">
      <h1 className="text-slate-500 text-left text-xl">
        Release Notes - Pace Planer App
      </h1>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">06.09.2024 - Pace Planer 3.1.0</label>
        <p>
          Feature: Mit einem einfachen Klick kannst du jetzt die aktuelle
          Uhrzeit direkt in das Eingabefeld übernehmen. Das spart Zeit und macht
          die Eingabe deiner Startzeit noch komfortabler.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">05.09.2024 - Pace Planer 3.0.0</label>
        <p>
          Feature: Mit der neuen Zieleinlaufzeit-Funktion kannst du deine
          Startzeit eingeben und berechnen, wann du die Ziellinie oder wichtige
          Meilensteine wie 5k, 10k und mehr während des Laufs erreichst. So
          kannst du deine Ankunftszeiten planen und den perfekten Moment mit
          Freunden und Familie teilen, um deinen Fortschritt und Erfolg
          gemeinsam zu feiern!
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">26.05.2024 - Pace Planer 2.0.1</label>
        <p>
          Patch: Unsinnige Zeitangaben werden nun abgefangen und verhindert.
          Wenn Stunden eingegeben werden, können die Minuten nicht größer als 59
          sein. Wenn Minuten eingegeben werden, können die Sekunden nicht größer
          als 59 sein.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">25.05.2024 - Pace Planer 2.0.0</label>
        <p>
          Major: Ein neues Design wurde implementiert. Die App wirkt nun noch
          mehr wie ein Taschenrechner. Ziel ist es, so wenig Platz wie möglich
          zu nutzen. Außerdem wurde die App um eine Funktion erweitert, die es
          ermöglicht, die Ziel-Pace für eine gegebene Distanz und Zielzeit zu
          berechnen.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">13.05.2024 - Pace Planer 1.0.0</label>
        <p>
          Stable: Ein Impressum und ein Unterseite über die App, samt
          Datenschutzerläuterungen wurden hinzugefügt. Die App ist nun
          vollständig barrierefrei, in der Google Suche auffindbar und erzielt
          bei den gängigen PageSpeed-Tools Höchstwerte.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">13.05.2024 - Pace Planer 0.2.0</label>
        <p>
          Beta: Das Layout der App wurde überarbeitet und auf Desktop sowie auf
          mobilen Geräten zentriert. Horizontales und vertikales scrollen wurde
          entfernt. Web-Hygiene wie Favicon, Lade-Animation und Meta-Tags wurden
          hinzugefügt.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">03.05.2024 - Pace Planer 0.1.0</label>
        <p>
          Beta: Die App berechnet nun die Zielzeiten für verschiedene Distanzen
          fehlerfrei bis auf die Sekunde genau.
        </p>
      </div>
      <div className="flex flex-col gap-6 text-slate-400 leading-6 text-left text-md">
        <label className="text-slate-600">01.05.2024 - Pace Planer 0.0.1</label>
        <p>
          Alpha: Das Grundgerüst der Pace Planer App steht. Die App berechnet
          noch etwas ungenau die Zielzeiten für verschiedene Distanzen auf
          Grundlage der eingegebenen Pace.
        </p>
      </div>
    </div>
  );
}
