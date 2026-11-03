# Cori voice clips

Builds the app's audio with the Piper "Cori (high)" British voice, following
Andy's 117-item pronunciation review (Nov 2026).

- `convert.py` turns app text into a Cori script (units, symbols, abbreviations,
  pauses). Each rule names the review item it came from.
- `cori.py` renders a script to MP3. Markup: `[[ phonemes ]]`, `{slower text}`,
  `^` short pause, `|` longer pause.

Setup (voice files are not committed, ~110 MB):

    pip install piper-tts
    mkdir -p tools/voice/voices
    curl -L -o tools/voice/voices/en_GB-cori-high.onnx      https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_GB/cori/high/en_GB-cori-high.onnx
    curl -L -o tools/voice/voices/en_GB-cori-high.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_GB/cori/high/en_GB-cori-high.onnx.json
