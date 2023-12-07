from flask import Flask, request, jsonify
from flask_cors import CORS 
import pickle
import pandas as pd
import json
from preprocessing import feature_engineer

app = Flask(__name__)
CORS(app, resources={r'/*': {'origins': '*'}})

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

# endpoint to get the csv file from the frontend
@app.route('/get_csv', methods=['POST'])
def get_csv():
    if request.method == 'POST':
        f = request.files.get('file')
        # read the csv file
        df = pd.read_csv(f)
        df = feature_engineer(df)

        FEATURES = [c for c in df.columns if c != 'level_group']

        # get unique session_ids from df
        session_ids = df.index.unique()

        # for each session_id, group_level in df, make a predictiom
        predictions = {}
        for session_id in session_ids:
            print(session_id)
            for grp in ['0-4', '5-12', '13-22']:
                q_range = range(1, 4) if grp == '0-4' else range(4, 14) if grp == '5-12' else range(14, 19)
                # select from df.loc[session_id] only the rows where level_group is grp
                df_grp = df.loc[session_id].loc[df.loc[session_id]['level_group'] == grp]
                for q in q_range:
                    model_name = f'{grp}_{q}'
                    model = models[model_name]
                    prediction = model.predict_proba(df_grp[FEATURES].astype('float32'))[:, 1].item()
                    # print(f'{q}: {prediction}')
                    predictions.setdefault(session_id, {})[q] = prediction
        return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)