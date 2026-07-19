from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "cv" / "magne-syljuasen-cv.pdf"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)

FONT_DIR = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("Arial", FONT_DIR / "arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", FONT_DIR / "arialbd.ttf"))

INK = colors.HexColor("#263129")
MUTED = colors.HexColor("#59645C")
ACCENT = colors.HexColor("#9B4D38")
RULE = colors.HexColor("#D8D0C3")
PAPER = colors.HexColor("#FAF8F3")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Name",
    fontName="Arial-Bold",
    fontSize=25,
    leading=28,
    textColor=INK,
    spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="Role",
    fontName="Arial",
    fontSize=11.5,
    leading=15,
    textColor=ACCENT,
    spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="Contact",
    fontName="Arial",
    fontSize=8.3,
    leading=11,
    textColor=MUTED,
    spaceAfter=9,
))
styles.add(ParagraphStyle(
    name="Section",
    fontName="Arial-Bold",
    fontSize=9.2,
    leading=12,
    textColor=ACCENT,
    spaceBefore=7,
    spaceAfter=5,
    uppercase=True,
    tracking=0.8,
))
styles.add(ParagraphStyle(
    name="BodyCV",
    fontName="Arial",
    fontSize=9.1,
    leading=13.2,
    textColor=INK,
    spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Job",
    fontName="Arial-Bold",
    fontSize=10.4,
    leading=13,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Meta",
    fontName="Arial",
    fontSize=8.2,
    leading=11,
    textColor=MUTED,
    alignment=TA_RIGHT,
))
styles.add(ParagraphStyle(
    name="BulletCV",
    fontName="Arial",
    fontSize=8.8,
    leading=12.3,
    textColor=INK,
    leftIndent=10,
    firstLineIndent=-8,
    spaceAfter=2.7,
))
styles.add(ParagraphStyle(
    name="ProjectTitle",
    fontName="Arial-Bold",
    fontSize=9.5,
    leading=12.5,
    textColor=INK,
    spaceAfter=2,
))
styles.add(ParagraphStyle(
    name="Small",
    fontName="Arial",
    fontSize=8.4,
    leading=11.8,
    textColor=INK,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="Footer",
    fontName="Arial",
    fontSize=7.2,
    leading=9,
    textColor=colors.HexColor("#7A817A"),
))


def link(label: str, url: str) -> str:
    return f'<a href="{url}" color="#59645C">{label}</a>'


def section(title: str):
    return [
        Paragraph(title.upper(), styles["Section"]),
        HRFlowable(width="100%", thickness=0.55, color=RULE, spaceAfter=5),
    ]


def role_row(title: str, period: str):
    table = Table(
        [[Paragraph(title, styles["Job"]), Paragraph(period, styles["Meta"])]],
        colWidths=[135 * mm, 39 * mm],
    )
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
    ]))
    return table


def bullet(text: str):
    return Paragraph(f"- {text}", styles["BulletCV"])


def project(title: str, description: str, keywords: str, url: str | None = None):
    heading = link(title, url) if url else title
    return KeepTogether([
        Paragraph(heading, styles["ProjectTitle"]),
        Paragraph(description, styles["Small"]),
        Paragraph(f"<font color='#59645C'><b>Teknologi og fag:</b> {keywords}</font>", styles["Small"]),
        Spacer(1, 2),
    ])


def page_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFont("Arial", 7.2)
    canvas.setFillColor(colors.HexColor("#7A817A"))
    canvas.drawString(18 * mm, 10 * mm, "Magne Syljuåsen - CV")
    canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f"Side {doc.page}")
    canvas.restoreState()


story = [
    Paragraph("Magne Syljuåsen", styles["Name"]),
    Paragraph("Sivilingeniør | Energi, data og digitale produkter", styles["Role"]),
    Paragraph(
        "451 92 540&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"
        + link("msylju@gmail.com", "mailto:msylju@gmail.com")
        + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Oslo&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"
        + link("LinkedIn", "https://no.linkedin.com/in/magne-sylju%C3%A5sen-35235738")
        + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"
        + link("GitHub", "https://github.com/magnesyljuasen")
        + "&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;"
        + link("Portefølje", "https://magnesyljuasen.github.io/portfolio/"),
        styles["Contact"],
    ),
]

story += section("Profil")
story.append(Paragraph(
    "Sivilingeniør utdannet innen geofag fra NTNU, med erfaring i skjæringspunktet mellom energi, grunnvarme, dataanalyse og programvareutvikling. Jeg bygger analysemodeller og digitale beslutningsverktøy i Python som gjør komplekse tekniske valg enklere å forstå og gjennomføre. Har utviklet produkter brukt i mer enn 20 kundeprosjekter, og verktøy som er solgt til Norsk Varmepumpeforening og Hafslund.",
    styles["BodyCV"],
))

story += section("Nøkkelkompetanse")
for text in [
    "Digital produktutvikling: fra faglig problem og datamodell til brukergrensesnitt, utrulling og videreutvikling.",
    "Energi og grunnvarme: energiplanlegging, bergvarme, GeoTermos, varmepumper, energibruk i bygg og energiforsyning.",
    "Data og modellering: Python, Streamlit, GIS, tidsserier, scenarioanalyse, kostnadsberegninger og visualisering.",
    "Beslutningsstøtte: omsetter store datamengder og komplekse beregninger til tydelige anbefalinger for kunder og prosjektteam.",
]:
    story.append(bullet(text))

story += section("Arbeidserfaring")
story.append(role_row("Seniorrådgiver - energi, grunnvarme og digitale produkter | Asplan Viak", "aug. 2021 - d.d."))
for text in [
    "Sentral i utviklingen av AV Energiplanlegging, et Python-basert beslutningsverktøy brukt i mer enn 20 prosjekter for kommuner, eiendomsaktører og energiselskaper.",
    "Utvikler analysemodeller og webløsninger i Python og Streamlit for energibruk, effektbehov, kostnader, utslipp og energiforsyning fra enkeltbygg til nasjonalt nivå.",
    "Tok Bergvarmekalkulatoren fra eget initiativ til et produkt solgt til Norsk Varmepumpeforening, og bygget GeoTermos-kalkulatoren som ble solgt til Hafslund.",
    "Gjennomfører energiplaner og scenarioanalyser basert på bygningsdata, GIS og reelle timeserier, og omsetter resultatene til konkrete tiltak og investeringsgrunnlag.",
    "Prosjekterer større brønnparker og kombinerer fagkompetanse innen geoenergi med automatisering, struktur og digital formidling.",
]:
    story.append(bullet(text))

story.append(Spacer(1, 4))
story.append(role_row("Grunnborer | Norges Geotekniske Institutt (NGI)", "jan. - juni 2020"))
story.append(bullet("Utførte geotekniske og miljøtekniske grunnundersøkelser, blant annet totalsondering, fjellkontroll, prøvetaking og kontroll av kalksementstabilisering."))

story.append(Spacer(1, 4))
story.append(role_row("Sommervikar | If Skadeforsikring", "2016, 2018 og 2019"))
story.append(bullet("Arbeidet med forbedringer i interne datasystemer og operative arbeidsprosesser."))

story += section("Utvalgte resultater og prosjekter")
story.append(project(
    "AV Energiplanlegging",
    "Bygget opp et digitalt produkt for tidligfase energiplanlegging som simulerer mer enn 20 energitiltak og er brukt i mer enn 20 kundeprosjekter. Løsningen kombinerer bygningsregister, energidata, kart og timesbaserte beregninger.",
    "Python, Streamlit, GIS, energimodellering, produktutvikling",
    "https://www.asplanviak.no/kvartalet/nyheter/sparer-penger-og-miljo-med-av-energiplanlegging/",
))
story.append(project(
    "Bergvarmekalkulatoren",
    "Initierte og utviklet en kalkulator for dimensjonering, lønnsomhet og miljøgevinst ved bergvarme. Produktet ble solgt til Norsk Varmepumpeforening og er publisert på Varmepumpeinfo.no.",
    "Python, bergvarme, økonomi, UX, kommersialisering",
    "https://www.varmepumpeinfo.no/bergvarme/kalkulator",
))

story.append(PageBreak())

story += section("Utvalgte resultater og prosjekter - fortsetter")
story.append(project(
    "GeoTermos-kalkulator",
    "Utviklet et scenarioverktøy som gjør komplekse termiske og økonomiske beregninger tilgjengelige for tidlig vurdering av GeoTermos. Produktet ble solgt til Hafslund.",
    "Python, Streamlit, geoenergi, simulering, økonomi",
    "https://av-geotermos-kalkulator.azurewebsites.net/",
))
story.append(project(
    "Energimål for bygg i Oslo",
    "Utviklet analysemodellen bak en utredning av Oslos energimål etter 2030. Modellen beregnet et teknisk effektiviseringspotensial på 4,78 TWh og sammenlignet kostnader og konsekvenser ved tre ambisjonsnivåer.",
    "Python, bygningsdata, kostnadsanalyse, energisystem",
    "https://www.klimaoslo.no/rapport/hva-bor-det-nye-energimalet-for-bygg-i-oslo-vaere/",
))
story.append(project(
    "Konvertering til vannbåren varme - Enova",
    "Utviklet analysemodell og skrev store deler av rapporten om potensial og kostnader ved konvertering i større norske bygg. Analysen viste et potensial på om lag 13 TWh/år og 3,5 GW frigjort effekt.",
    "Python, nasjonale bygningsdata, vannbåren varme, rapportering",
    "https://enova.no/nb/bedrift/bygg-og-eiendom/nye-funn-om-kostnader-for-konvertering-til-vannbaren-varme-i-bygg",
))
story.append(project(
    "Energiplaner for UiT og Kristiansand kommune",
    "Analyserte reelle energi- og driftsdata for 15 campusbygg ved UiT og bygget en porteføljeløsning for 92 kommunale bygg i Kristiansand. Arbeidet ga konkrete tiltak og investeringsgrunnlag for energieffektivisering.",
    "Python, tidsserier, ENØK, porteføljeanalyse, visualisering",
))
story.append(project(
    "Ny by - ny flyplass, Bodø",
    "Modellerte oppvarmings- og elektrisitetsbehov for rundt 2 000 planlagte bygg og visualiserte effekten av ulike energiforsynings- og effektiviseringstiltak i tidlig byplanlegging.",
    "GIS, Python, byutvikling, energiscenarioer",
    "https://ny-by-ny-flyplass.azurewebsites.net/",
))
story.append(project(
    "Prosjektering av større brønnparker",
    "Har dimensjonert og plassert energibrønner og utarbeidet tekniske beskrivelser for blant annet Flåtaløkka skole, Nord universitet, Andslimoen omsorgsboliger, Myrane idrettshall og svømmeanlegg og Skoppum stasjon.",
    "Bergvarme, dimensjonering, GIS, teknisk prosjektering",
))
story.append(project(
    "Energiscenarioer for Dokken i Bergen",
    "Utviklet et scenarioverktøy for et større byutviklingsområde som viser hvordan ulike valg av energiforsyning påvirker energi, effekt og infrastruktur.",
    "Python, GIS, byutvikling, scenarioanalyse, beslutningsstøtte",
))
story.append(project(
    "Kringsjå studentby",
    "Analyserte reelle strøm-, varme- og produksjonsdata for 36 bygg og utviklet langsiktige energiscenarioer. Fulgte senere opp tiltak i detaljprosjekt, inkludert varmepumpe og GeoTermos.",
    "Tidsserier, energiplanlegging, grunnvarme, detaljprosjektering",
))

story += section("Utdanning")
story.append(role_row("Master i teknologi (sivilingeniør), tekniske geofag | NTNU", "2015 - 2021"))
story.append(Paragraph("Fordypning i ingeniørgeologi og bergmekanikk.", styles["Small"]))

story += section("Teknologi og verktøy")
story.append(Paragraph(
    "<b>Programmering og data:</b> Python, Streamlit, pandas, dataanalyse, tidsserier, HTML, CSS, Git, Azure<br/>"
    "<b>Geo og prosjektering:</b> GIS/ArcGIS, AutoCAD, energimodellering, bergvarme og grunnvarme<br/>"
    "<b>Arbeidsform:</b> KI-assistert utvikling, produktutvikling, automatisering, visualisering og teknisk rapportering",
    styles["BodyCV"],
))

story += section("Faglig bidrag og ledelse")
story.append(bullet("Medforfatter av konferanseartikkel om termomekaniske egenskaper i norsk kvikkleire, innsendt til ICSMGE 2022."))
story.append(bullet("Leder for NTNUI Fotball (ca. 270 medlemmer), 2019-2020, og spillende trener for NTNUI B-laget, 2020-2021."))

story += section("Språk")
story.append(Paragraph("Norsk - morsmål&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Engelsk - flytende&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Dansk - flytende muntlig", styles["BodyCV"]))

doc = SimpleDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    rightMargin=18 * mm,
    leftMargin=18 * mm,
    topMargin=15 * mm,
    bottomMargin=17 * mm,
    title="CV - Magne Syljuåsen",
    author="Magne Syljuåsen",
    subject="Sivilingeniør, energi, data og digitale produkter",
    keywords="sivilingeniør, energi, energiplanlegging, grunnvarme, bergvarme, Python, Streamlit, GIS, dataanalyse, produktutvikling",
)
doc.build(story, onFirstPage=page_background, onLaterPages=page_background)
print(OUTPUT)
