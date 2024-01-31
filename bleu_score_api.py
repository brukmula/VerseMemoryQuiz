from flask import Flask, request, jsonify
from flask_cors import CORS
import jieba
import sacrebleu

app = Flask(__name__)
CORS(app)

def segment_chinese_text(text):
    return ' '.join(jieba.cut(text))

def calculate_bleu(candidate, reference):
    references = [reference]
    bleu = sacrebleu.corpus_bleu([candidate], [references])
    return bleu.score

@app.route('/calculate-bleu', methods=['POST'])
def get_bleu_score():
    data = request.get_json()
    candidate_text = data['candidate']
    reference_text = data['reference']

    segmented_candidate = segment_chinese_text(candidate_text)
    segmented_reference = segment_chinese_text(reference_text)

    bleu_score = calculate_bleu(segmented_candidate, segmented_reference)

    return jsonify({'bleu_score': bleu_score})

if __name__ == '__main__':
    app.run(debug=True)
