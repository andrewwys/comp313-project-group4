from flask import Flask, request, jsonify
import pickle
import pandas as pd
import json

app = Flask(__name__)

# Load your trained models using pickle
models = {}
for q in range(1, 19):
    if q<=3: grp = '0-4'
    elif q<=13: grp = '5-12'
    elif q<=22: grp = '13-22'

    model_name = f'{grp}_{q}'
    filename = f'{model_name}_model.pkl'
    with open(filename, 'rb') as file:
        models[model_name] = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    print(type(data))
    # Assuming data is a dictionary where keys are feature names
    # json_data = json.loads(data)

    # input_data = pd.DataFrame.from_dict(data, orient='index')

    # input_data = pd.read_json(json_data, orient="split")
    input_data = pd.DataFrame(data, index=[0])
    
    input_data.head(2)
    FEATURES = [c for c in input_data.columns if c != 'level_group']

    # input_data = pd.DataFrame(data, index=[0])

    predictions = {}

    for q in range(1, 19):
        if q<=3: grp = '0-4'
        elif q<=13: grp = '5-12'
        elif q<=22: grp = '13-22'

        model_name = f'{grp}_{q}'
        model = models[model_name]
        prediction = model.predict_proba(input_data[FEATURES].astype('float32'))[:, 1].item()
        predictions[model_name] = prediction

    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)