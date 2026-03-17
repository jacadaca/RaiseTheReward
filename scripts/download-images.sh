#!/bin/bash
# Download case images from public law enforcement sources
# Run from the project root: bash scripts/download-images.sh

mkdir -p public/cases

echo "Downloading case images..."

# FBI Most Wanted
curl -L -o public/cases/ruja-ignatova.jpg "https://www.fbi.gov/wanted/topten/ruja-ignatova/@@images/image/preview" 2>/dev/null && echo "✓ Ruja Ignatova" || echo "✗ Ruja Ignatova (failed)"
curl -L -o public/cases/alexis-flores.jpg "https://www.fbi.gov/wanted/topten/alexis-flores/@@images/image/preview" 2>/dev/null && echo "✓ Alexis Flores" || echo "✗ Alexis Flores (failed)"
curl -L -o public/cases/bhadreshkumar-patel.jpg "https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/@@images/image/preview" 2>/dev/null && echo "✓ Bhadreshkumar Patel" || echo "✗ Bhadreshkumar Patel (failed)"
curl -L -o public/cases/eugene-palmer.jpg "https://www.fbi.gov/wanted/topten/eugene-palmer/@@images/image/preview" 2>/dev/null && echo "✓ Eugene Palmer" || echo "✗ Eugene Palmer (failed)"

# NCMEC Missing Persons - these may need manual download from missingkids.org
curl -L -o public/cases/kyron-horman.jpg "https://www.missingkids.org/poster/NCMC/1146067/1/screen" 2>/dev/null && echo "✓ Kyron Horman" || echo "✗ Kyron Horman (may need manual download)"
curl -L -o public/cases/asha-degree.jpg "https://www.missingkids.org/poster/NCMC/1205987/1/screen" 2>/dev/null && echo "✓ Asha Degree" || echo "✗ Asha Degree (may need manual download)"
curl -L -o public/cases/michaela-garecht.jpg "https://www.missingkids.org/poster/NCMC/1132367/1/screen" 2>/dev/null && echo "✓ Michaela Garecht" || echo "✗ Michaela Garecht (may need manual download)"
curl -L -o public/cases/relisha-rudd.jpg "https://www.missingkids.org/poster/NCMC/1255450/1/screen" 2>/dev/null && echo "✓ Relisha Rudd" || echo "✗ Relisha Rudd (may need manual download)"

# Unsolved crimes - these likely need manual download from news/public sources
echo ""
echo "── Manual downloads needed ──"
echo "The following cases need photos found and saved manually:"
echo "  public/cases/delphi-murders.jpg    (Abby Williams & Libby German)"
echo "  public/cases/missy-bevers.jpg      (Missy Bevers)"
echo "  public/cases/springfield-three.jpg (The Springfield Three)"
echo "  public/cases/natalee-holloway.jpg  (Natalee Holloway)"
echo ""
echo "Search for public domain or press photos for these cases."
echo "Save them to public/cases/ with the filenames above."
echo ""
echo "Done! Now update src/lib/cases.ts to use local paths:"
echo '  imageUrl: "/cases/ruja-ignatova.jpg"'
echo "(The download-images script already uses matching filenames.)"
