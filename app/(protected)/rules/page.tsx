export default function RulesPage() {
  return (
    <>
      <h1 className="text-xl">Bötzinger Flunkyball-Regelwerk</h1>
      <h2 className="text-lg">§ 1 Spielfeld</h2>
      <p>
        (1) Das Spielfeld besteht aus einem inneren Feld (Lauffeld), in dessen
        Mitte sich ein Wurfziel befindet und zwei äußeren Feldern (Teamraum) in
        denen sich die Teams und deren Biere befinden.
      </p>
      <p>
        (2) Die Länge des inneren Feldes beträgt 18 Schritte. Die Mitte des
        Lauffeldes ist mit der Stellfläche des Wurfzieles markiert. Lauffeld und
        Teamraum sind durch die Grundlinie voneinander getrennt. Die Biere der
        jeweiligen Teams müssen auf der Grundlinie ungeschützt abgestellt
        werden.
      </p>
      <h2 className="text-lg">§ 2 Spielgerät</h2>
      <p>
        (1) Das bevorzugtes Wurfziel ist eine 1 Liter Hartplastikflasche, welche
        zu 1/3 mit einer nicht ekelhaften Flüssigkeit gefüllt ist. Falls
        notwendig kann der Schiedsrichter jedes Objekt als Wurfziel bestimmen,
        welches mindestens die Größe einer üblichen 0,5l Flasche besitzt und
        genügend Gewicht und Standfestigkeit aufweist.
      </p>
      <p>
        (2) Als Wurfgeschoss ist ein Handball der Größe 2 die bevorzugte Wahl.
      </p>
      <p>
        (3) Bier, welches nicht vom Ausrichter gestellt wird, darf nur mit der
        Zustimmung des Schiedsrichters und des gegnerischen Teams verwendet
        werden.
      </p>
      <h2 className="text-lg">§ 3 Teams</h2>
      <p>
        (1) Die Teamstärke im Turniermodus beträgt 2 Personen. Sollte ein
        Spieler während des Spielverlaufes Opfer des Bieres werden, verliert das
        Team das Spiel.
      </p>
      <p>
        (2) Jedes Team hat einen Teamführer. Dieser ist 1. Ansprechpartner für
        die Schiris und Verhandlungsführer bei Bedarf.
      </p>
      <h2 className="text-lg">§ 4 Spielleitung</h2>
      <p>
        (1) Die Einhaltung der Regeln kontrolliert der Schiedsrichter. Dieser
        kann als Hilfe Seitenrichter für jedes Team aus unparteiischen Personen
        rekrutieren (z.B. für die K.O-Phase). Der Hauptschiedsrichter trifft
        alle Entscheidungen nach eigenem Ermessen und Berücksichtigung des
        Regelwerks.
      </p>
      <h2 className="text-lg">§ 5 Spielablauf</h2>
      <p>
        (1) Beginnrecht, Seiten- und Ballwahl: Zu Beginn eines jeden Spieles
        treten die beiden Teamführer gegeneinander im Schere, Stein, Papier an.
        Der Gewinner darf entscheiden ob er den ersten Wurf wirft oder die Seite
        wählt, der Verlierer dann das andere.
      </p>
      <p>
        (2) Position des Bieres, Aufstellung und Werfer Reihenfolge: Jedes Team
        darf sich frei im Teamraum platzieren. Die Spielbiere müssen auf der
        Grundlinie stehen. Die Grundlinie darf nicht übertreten aber betreten
        werden. Es darf jeder von jeder Position im Teamraum werfen, die Biere
        dürfen allerdings nicht umgestellt werden. Die Startaufstellung beim 1.
        Wurf eines Teams gibt die Wurfreihenfolge vor. Der erste Werfer ist die
        linke Person, der Letzte die rechte.
      </p>
      <p>
        (3) Wurf und Trinkphase: Beide Teams werfen abwechselnd das Wurfgeschoss
        durch die Luft und versuchen dabei das Wurfziel zu treffen. Geworfen
        wird mit der „Hand über Schulter Technik“. Es darf erst geworfen werden,
        wenn das Bier des Gegners abgestellt wurde. Verzögerungen werden
        geahndet (siehe Strafenkatalog). Sobald der Ball hinter der Mittellinie
        ist oder er das Wurfziel trifft, dürfen beide Läufer des Gegnerteams die
        Grundlinie übertreten, um den Ball aufzusammeln und gegebenenfalls das
        Wurfziel aufzustellen. Jedes Teammitglied muss sich um ein Gegenstand
        kümmern, beides von einer Person wird geahndet. Läuft ein Spieler zu
        früh los, muss er erst wieder mit einem Fuß im eigenen Teamraum gewesen
        sein, bevor er den Ball holen oder die Flasche aufstellen darf.
        Maximalkraftwürfe und sehr harte sind untersagt. Welcher Wurf als zu
        hart gilt, bestimmt der Schiedsrichter! Das Wurfgeschoss muss spätestens
        bis zum gegnerischen Teambereich einmal den Boden berührt haben. Wird
        das Wurfgeschoss auf den Körper der Gegenspieler geworfen erfolgen
        Strafen bis hin zur Disqualifikation. Der Versuch die gegnerischen Biere
        umzuwerfen ist erlaubt. Solange das WZ nicht umgeworfen wurde, darf
        keine Hand das Bier berühren. Wird das WZ umgeworfen, darf so lange
        getrunken werden, bis das WZ wieder aufrecht steht und die Läufer und
        der Ball sich im oder hinter dem Teamraum der Gegnermannschaft befinden.
        Der Schiedsrichter gibt das Stoppsignal. Rollt der Ball an eine nicht zu
        erreichende Stelle oder kann etwas nicht in angebrachter Zeit erfüllt
        werden (Ball unter Auto, Flasche unerreichbar, …), so kann der
        Schiedsrichter das Stoppsignal senden, sobald der andere Teil erfüllt
        wurde. Jeder Spieler darf nur sein eigenes Bier trinken und muss dieses
        bei jedem Wurf vor sich platzieren.
      </p>
      <p>
        (4) Ende der Trinkzeit: Sobald der Schiedsrichter das Stoppsignal
        gegeben hat, ist umgehend das Bier abzusetzen. Der Mund darf sich
        während der Absetzbewegung maximal noch 3 Sekunden am Mund befinden.
      </p>
      <p>
        (5) Spielende: Gewonnen hat das Team welche alle Spielbiere (und
        gegebenenfalls Strafbiere) leergetrunken hat oder wenn der Gegner
        disqualifiziert wurde.
      </p>
      <p>
        (6) Leere Biere: Gilt für alle Spielphasen: 3 Sekunden Regel; Ein Bier
        ist dann leer, wenn nach dem Umdrehen 3 Sekunden lang nur wenige Tropfen
        Bier/Schaum aus der Flasche läuft. Der Spieler entscheidet selbst, wann
        er die Flasche als leer werten lassen will. Kündigt er an, dass seine
        Flasche leer ist, so muss diese innerhalb von 3 Sekunden umgedreht
        werden. Das Bier darf erst auf Signal des Schiedsrichters umgedreht
        werden. Dem Schiedsrichter steht es frei zu entscheiden, ob er selbst
        eine Flasche umdreht oder der Spieler dies macht. Wurden alle Biere
        eines Spielers als leer bestätigt, darf dieser nicht mehr werfen, muss
        aber beim Aufstellen und Ball holen helfen.
      </p>
      <p>
        (7) Strafbiere und Schäumen: Strafbiere dürfen nicht weitergereicht
        werden. Ein Verteilen des Flascheninhaltes in andere Flaschen ist nicht
        zulässig. Ein Bier gilt als übergeschäumt, sobald geringste Mengen
        Schaum den Hals runterlaufen.
      </p>
      <p>
        (8) Spieldauer: Die Spieldauer für Gruppenspiele beträgt 12 Minuten. Ist
        die reguläre Spieldauer abgelaufen, kann der Schiedsrichter nach 5
        Würfen pro Mannschaft ein Ex-Bierbattle für die Entscheidung ausrufen.
        Beide Teams können sich bereits vorher auf ein Ex- Bierbattle einigen.
        Beim EBB gewinnt die Seite, welche alle noch verbliebenen Biere am
        schnellsten austrinkt. Ein Bier gilt hier als leer, solange weniger als
        ein Schluck Bier aus der Flasche läuft. Am EBB nehmen nur die Spieler
        teil, welche vorher noch im Spiel waren.
      </p>
      <h2 className="text-lg">§ 6 Strafenkatalog</h2>
      <p>
        (1) Bei Ermessensentscheidungen kann der Schiedsrichter bei knappen
        Entscheidungen maximal 2 Verwarnungen erteilen.
      </p>
      <p>
        (2) Eine Trinkrunde (TR) = bei einem Treffer darf eine Runde nichts
        getrunken werden
      </p>
      <p>
        (3) Disqualifikation der Mannschaft ist im Ermessen des Schiedsrichters.
        Bei Disqualifikation verliert die Mannschaft das Spiel
      </p>
      <p>(4) Eine Trinkrunde:</p>
      <ul>
        <li>a. Überschäumen des Bieres</li>
        <li>b. Frühzeitiges Anfassen des Bier</li>
        <li> c. Verschließen des Bieres nach dem Abstellen</li>
        <li> d. Übertreten der Grundlinie</li>
        <li>
          e. Zeitverzögerung nach bereits 2 Ermahnungen des Schiedsrichters
        </li>
        <li>f. Wurfreihenfolge nicht eingehalten</li>
        <li>g. Zu früh geworfen</li>
        <li>h. Geringfügig zu lange getrunken</li>
        <li>
          i. Bier zu weit von der Grundlinie entfernt oder Abwurfmöglichkeit
          verdeckt
        </li>
      </ul>
      <p>(5) Ein Strafbier:</p>
      <ul>
        <li>a. Bier umkippen unabhängig vom Bierverlust (immer)</li>
        <li>b. Kotzen</li>
        <li>
          c. Direkte Würfe auf den Gegner über Schienbeinhöhe (ganzes Team)
        </li>
        <li>d. Mehr als eine geringe Menge bei beim umdrehen</li>
        <li> e. Wiederholtes Diskutieren mit dem Schiri</li>
        <li> f. Beleidigung des Gegners oder des Schiedsrichters</li>
        <li> g. Deutlich zu lang getrunken</li>
        <li>h. Bier illegal weitergegeben oder getauscht</li>
        <li> i. Eine Person stellt Wurfziel auf und holt den Ball</li>
        <li>j. Bier umgedreht, ohne die Aufmerksamkeit des Schiedsrichters</li>
      </ul>
      <p>(6) Disqualifikation:</p>
      <ul>
        <li>
          a. Würfe auf Gesichtshöhe der Gegner und harte Würfe auf den
          Oberkörper
        </li>
        <li>b. Verweigerung den Anweisungen des Schiedsrichters zu folgen</li>
        <li>c. Wiederholte Beleidigung von Gegner oder Schiedsrichter</li>
        <li>
          d. Von der Turnierleitung als Opfer des Bieres für Spielunfähig
          erklärt
        </li>
        <li>e. Spielsabotage</li>
      </ul>
      <h2 className="text-lg">§ 7 Weiteres</h2>
      <p>
        (1) Zeigen sich während des Spieles Lücken im Regelwerk oder treten
        seltene Sonderfälle auf, welche nicht alle im Regelwerk erfasst werden
        können, so obliegt es zunächst den beiden betroffenen Mannschaften des
        betreffenden Spieles sich über eine Lösung einigen. Gelingt dieses nicht
        hat der Schiedsrichter das letzte Wort. Dieser kann den Rat der
        Organisatoren einholen, muss dies aber nicht.
      </p>
    </>
  );
}
