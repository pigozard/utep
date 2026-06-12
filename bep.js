/* ============================================================
   UTEP — Bilan Éducatif Partagé
   Gestion des données, import/export JSON et export PDF
   ============================================================ */

let etpChoix = "";

function choisirETP(v) {
  etpChoix = (etpChoix === v) ? "" : v;
  document.querySelectorAll("[data-etp]").forEach(b => {
    b.classList.toggle("on", b.dataset.etp === etpChoix);
  });
}

function collecter() {
  const d = {};
  document.querySelectorAll("[data-cle]").forEach(el => {
    d[el.dataset.cle] = el.value;
  });
  d.participationETP = etpChoix;
  d._meta = {
    document: "Mon bilan éducatif",
    genere: new Date().toISOString(),
  };
  return d;
}

function exportJSON() {
  const data = collecter();
  const nom = (data.patient || "bilan")
    .replace(/[^a-z0-9]/gi, "_")
    .slice(0, 30);
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `bilan_educatif_${nom}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importer(e) {
  const f = e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const d = JSON.parse(r.result);
      document.querySelectorAll("[data-cle]").forEach(el => {
        if (d[el.dataset.cle] !== undefined) el.value = d[el.dataset.cle];
      });
      if (d.participationETP) {
        etpChoix = "";
        choisirETP(d.participationETP);
      }
    } catch {
      alert("Fichier illisible. Choisissez un .json enregistré depuis ce formulaire.");
    }
  };
  r.readAsText(f);
}

function exportPDF() {
  const feuille = document.getElementById("feuille");

  /* Remplacer les textarea par des div pour que l'impression
     affiche le contenu complet (les textarea tronquent à la
     hauteur visible). */
  const remplaces = [];
  feuille.querySelectorAll("textarea").forEach(ta => {
    const div = document.createElement("div");
    div.className = "impression-bloc";
    div.textContent = ta.value || " ";
    div.style.cssText =
      "white-space:pre-wrap;word-break:break-word;min-height:48px;" +
      "border-radius:10px;padding:10px 12px;font-size:14px;" +
      "font-family:inherit;line-height:1.5";
    ta.style.display = "none";
    ta.parentNode.insertBefore(div, ta);
    remplaces.push({ ta, div });
  });

  const restaurer = () => {
    remplaces.forEach(({ ta, div }) => {
      ta.style.display = "";
      div.remove();
    });
    window.removeEventListener("afterprint", restaurer);
  };

  window.addEventListener("afterprint", restaurer);
  window.print();

  /* Filet de sécurité si afterprint ne se déclenche pas */
  setTimeout(() => {
    if (remplaces[0] && remplaces[0].div.isConnected) restaurer();
  }, 1500);
}
