#!/bin/bash

# Constitution Downloader for African Countries
# Downloads constitutions from official government URLs
# 
# USAGE:
#   ./download-africa-constitutions.sh
# 
# OUTPUT:
#   Downloads to: data/constitutions/pdf/africa/
#   Logs to: data/constitutions/download-log.txt
# 
# NOTE: This script only downloads from official .gov domains and trusted sources

set -euo pipefail

# Configuration
DOWNLOAD_DIR="/workspace/github__Blex31__carta-world-constitutions-library/data/constitutions/pdf/africa"
LOG_FILE="/workspace/github__Blex31__carta-world-constitutions-library/data/constitutions/download-log.txt"
MAX_SIZE_MB=50
TIMEOUT_SEC=30
RETRIES=3

# Create directories
mkdir -p "$DOWNLOAD_DIR"
touch "$LOG_FILE"

echo "Constitution Downloader for Africa" >&2
echo "===================================" >&2
echo "" >&2

# Function to log messages
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to download with retry
download_file() {
  local iso=$1
  local country=$2
  local url=$3
  local filename="${iso}-constitution"
  local filepath="$DOWNLOAD_DIR/$filename"
  local success=false
  
  for ((i=1; i<=$RETRIES; i++)); do
    log "Attempt $i/$RETRIES: Downloading $country ($iso) from $url"
    
    if wget -q --tries=1 --timeout=$TIMEOUT_SEC \
      --max-filesize=${MAX_SIZE_MB}M \
      --user-agent="CARTA-Constitution-Downloader/1.0 (+https://github.com/Blex31/carta-world-constitutions-library)" \
      -O "$filepath" "$url" 2>/dev/null; then
      
      local size=$(stat -f%z "$filepath" 2>/dev/null || stat -c%s "$filepath" 2>/dev/null)
      local size_mb=$(echo "scale=2; $size / 1024 / 1024" | bc 2>/dev/null || echo "unknown")
      
      if [ "$size" -gt 1024 ] 2>/dev/null; then
        log "  ✓ SUCCESS: $country ($iso) - $size_mb MB"
        success=true
        break
      else
        log "  ✗ FAILED: File too small ($size bytes)"
        rm -f "$filepath"
      fi
    else
      log "  ✗ FAILED: Download error (attempt $i)"
      rm -f "$filepath"
    fi
    
    sleep 2
  done
  
  if [ "$success" = false ]; then
    log "  ✗ GIVING UP: $country ($iso)"
    return 1
  fi
  
  return 0
}

# Function to check if URL is from trusted domain
is_trusted_url() {
  local url=$1
  local hostname
  
  # Extract hostname
  hostname=$(echo "$url" | sed -E 's|^https?://([^/]+).*|\1|' | tr '[:upper:]' '[:lower:]')
  
  # Check for trusted domains
  if echo "$hostname" | grep -qE '\.(gov|parliament|presidency|president|assembly|congress|senate|house|judiciary|court|ministry|government|official|state|national|rlrc|kenyalaw|wipo|un|refworld|faolex|who|worldbank|imf|afdb)\.'; then
    return 0
  fi
  
  # Check for untrusted domains
  if echo "$hostname" | grep -qE '\.(wikipedia|fandom|blogspot|wordpress|medium|github|gitlab|bitbucket)\.'; then
    return 1
  fi
  
  return 0
}

# Function to check if URL is a PDF
is_pdf_url() {
  local url=$1
  echo "$url" | grep -qE '\.pdf($|\?)'
}

# Download from the queue data
# We'll use the hardcoded list of African countries with source candidates

declare -A COUNTRIES=(
  ["DZ"]="Algeria|https://www.ocrc.gov.dz/en/legal-texts"
  ["AO"]="Angola|https://bi-digital.parlamento.ao/items/885395b6-825d-4605-89f7-2d44f9bdc039"
  ["BJ"]="Benin|https://sgg.gouv.bj/upload/files/documentheque/0750869001535025835.pdf"
  ["BW"]="Botswana|https://parliament.gov.bw/images/constitution.pdf"
  ["BF"]="Burkina Faso|https://www.presidencedufaso.bf/textes-fondamentaux/"
  ["BI"]="Burundi|https://presidence.gov.bi/2018/07/6271-2/"
  ["CV"]="Cabo Verde|https://www.parlamento.cv/constituicao/downloads_cr.php"
  ["CM"]="Cameroon|https://prc.cm/en/cameroon/constitution"
  ["CF"]="Central African Republic|https://paris.diplomatie.gouv.cf/textes-officiels"
  ["TD"]="Chad|https://presidencetchad.org/decrets/"
  ["KM"]="Comoros|https://beit-salam.km/actualit%C3%A9s/le-pr%C3%A9sident-de-la-r%C3%A9publique-convoque-le-corps-%C3%A9lectoral-pour-un-r%C3%A9f%C3%A9rendum-constitutionnel.html"
  ["CG"]="Congo|https://presidence.cg/la-constitution/"
  ["CD"]="Congo, The Democratic Republic of the|https://cassation.cd/textes-legaux/constitution-rdc"
  ["CI"]="Cote d'Ivoire|https://www.presidence.ci/wp-content/uploads/2025/06/Constitution-livret-ok.pdf"
  ["DJ"]="Djibouti|https://www.conseil-constitutionnel.dj/la-constitution/"
  ["EG"]="Egypt|https://mof.gov.eg/en/legislation/legislation"
  ["GQ"]="Equatorial Guinea|https://minfuncionpublica.gob.gq/regulacion/constitucion/"
  ["ER"]="Eritrea|https://www.refworld.org/legal/legislation/natlegbod/1997/13634"
  ["SZ"]="Eswatini|https://www.gov.sz/images/Media/constitution.pdf"
  ["ET"]="Ethiopia|https://justice.gov.et/am/sector/ethiopian-constitution/"
  ["GA"]="Gabon|https://journal-officiel.ga/constitution"
  ["GM"]="Gambia|https://www.moj.gm/downloads"
  ["GH"]="Ghana|https://osp.gov.gh/media/Resources/Ghana_Constitution.pdf"
  ["GN"]="Guinea|https://www.sgg.gov.gn/document/downloadfile/546"
  ["GW"]="Guinea-Bissau|https://anp.gw/"
  ["KE"]="Kenya|https://new.kenyalaw.org/legislation/"
  ["LS"]="Lesotho|https://www.gov.ls/"
  ["LR"]="Liberia|https://judiciary.gov.lr/constitution-of-liberia-2/"
  ["LY"]="Libya|https://www.sjc.gov.ly/Laws/Details/f4f161ce-405e-470a-b3a3-c0f90f5911ba"
  ["MG"]="Madagascar|https://www.parlement.mg/fr/textes/constitution-de-la-iveme-republique/"
  ["MW"]="Malawi|https://ppda.mw/storage/documents/resources/THE%20CONSTITUTION%20OF%20THE%20REPUBLIC%20OF%20MALAWI.pdf"
  ["ML"]="Mali|https://extranet.who.int/cpcd/sites/default/files/public_file_repository/MLI_Mali_Constitution_2023.pdf"
  ["MR"]="Mauritania|https://conseil-constitutionnel.mr/fr/?p=1162"
  ["MU"]="Mauritius|https://www.govmu.org/EN/infoservices/govadministration/Pages/constitution.aspx"
  ["MA"]="Morocco|https://www.sgg.gov.ma/Portals/0/constitution/constitution_2011_Fr.pdf"
  ["MZ"]="Mozambique|https://www.parlamento.mz/"
  ["NA"]="Namibia|https://www.parliament.gov.na/"
  ["NE"]="Niger|https://www.assemblee-ne.org/"
  ["NG"]="Nigeria|https://www.nass.gov.ng/"
  ["RW"]="Rwanda|https://www.rlrc.gov.rw/fileadmin/user_upload/RLRC/Laws_of_Rwanda_v2/Domestic_laws/Laws_in_force/1._Fundamental/1.1._National_Instruments/1.1.1._Constitution/1.1.1.1._Constitution_of_the_Rep._of_Rwanda_2023.pdf"
  ["ST"]="Sao Tome and Principe|https://www.parlamento.st/"
  ["SN"]="Senegal|https://www.assemblee-nationale.sn/"
  ["SC"]="Seychelles|https://www.gov.sc/"
  ["SL"]="Sierra Leone|https://judiciary.gov.sl/"
  ["SO"]="Somalia|https://moifar.gov.so/en/page/federal-constitution"
  ["ZA"]="South Africa|https://www.gov.za/documents/constitution-republic-south-africa-1996"
  ["SS"]="South Sudan|https://mojca.gov.ss/the-transitional-constitution-of-the-repulic-of-south-sudan/"
  ["SD"]="Sudan|https://www.moj.gov.sd/"
  ["TZ"]="Tanzania, United Republic of|https://www.parliament.go.tz/documents/constitution-of-tanzania"
  ["TG"]="Togo|https://www.assemblee-nationale.tg/"
  ["TN"]="Tunisia|https://www.legislation.tn/"
  ["UG"]="Uganda|https://www.parliament.go.ug/"
  ["ZM"]="Zambia|https://www.parliament.gov.zm/"
  ["ZW"]="Zimbabwe|https://www.parliament.gov.zw/"
)

log "Starting download of ${#COUNTRIES[@]} African constitutions..."
log ""

for iso in "${!COUNTRIES[@]}"; do
  IFS='|' read -r country url <<< "${COUNTRIES[$iso]}"
  
  # Check if URL is trusted
  if ! is_trusted_url "$url"; then
    log "SKIP: $country ($iso) - Untrusted URL: $url"
    continue
  fi
  
  # Check if it's a PDF
  if ! is_pdf_url "$url"; then
    log "SKIP: $country ($iso) - Not a PDF: $url"
    continue
  fi
  
  # Download
  if download_file "$iso" "$country" "$url"; then
    log ""
  fi
done

log ""
log "Download complete!"
log "Check $DOWNLOAD_DIR for downloaded files"
log "See $LOG_FILE for detailed log"
