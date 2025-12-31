
function generate(){
  const subjects=document.getElementById("subjects").value.split(",").map(s=>s.trim()).filter(Boolean);
  const weak=document.getElementById("weak").value.split(",").map(s=>s.trim());
  const strong=document.getElementById("strong").value.split(",").map(s=>s.trim());
  const hours=Number(document.getElementById("hours").value);
  const start=document.getElementById("start").value;
  const energy=document.getElementById("energy").value;

  if(!subjects.length||!hours||!start){alert("Fill all fields");return;}

  let maxSession=energy==="high"?45:energy==="low"?25:35;
  let totalMin=hours*60;
  let breakMin=5;

  let pool=subjects.map(s=>{
    let w=2;
    if(weak.includes(s))w=3;
    if(strong.includes(s))w=1;
    return{subject:s,weight:w};
  });

  let totalWeight=pool.reduce((a,b)=>a+b.weight,0);
  pool=pool.map(p=>({...p,minutes:Math.round((p.weight/totalWeight)*totalMin)}));
  pool.sort((a,b)=>b.weight-a.weight);

  let [h,m]=start.split(":").map(Number);
  let current=h*60+m;
  const out=document.getElementById("output");
  out.innerHTML="";

  function fmt(t){let hr=Math.floor(t/60)%24;let mn=t%60;let ap=hr>=12?"PM":"AM";hr=hr%12||12;return`${hr}:${mn.toString().padStart(2,"0")} ${ap}`;}

  pool.forEach(p=>{
    let rem=p.minutes;
    while(rem>0){
      let dur=Math.min(maxSession,rem);
      out.innerHTML+=`<tr class="${p.weight===3?"weak":""}"><td>${fmt(current)} – ${fmt(current+dur)}</td><td>${p.subject}${p.weight===3?" (Focus)":""}</td></tr>`;
      current+=dur;rem-=dur;
      if(rem>0){out.innerHTML+=`<tr class="break"><td>${fmt(current)} – ${fmt(current+breakMin)}</td><td>Break</td></tr>`;current+=breakMin;}
    }
  });
}

function downloadPDF(){
  const{jsPDF}=window.jspdf;
  const doc=new jsPDF();
  doc.text("SmartStudy AI - Daily Timetable",14,20);
  let y=30;
  document.querySelectorAll("#output tr").forEach(r=>{
    const t=r.innerText;
    if(y>280){doc.addPage();y=20;}
    doc.text(t,14,y);y+=8;
  });
  doc.save("SmartStudyAI_Timetable.pdf");
}

function askCoach(){
  const q=document.getElementById("question").value;
  const r=document.getElementById("coachReply");
  if(!q)return;
  r.style.display="block";
  r.innerHTML="Analyzing your question based on your class and board…";
  setTimeout(()=>{
    r.innerHTML=`<strong>Coach:</strong> For your level, focus on textbook concepts first, then practice questions. Weak subjects should get daily revision.`;
  },1200);
}
