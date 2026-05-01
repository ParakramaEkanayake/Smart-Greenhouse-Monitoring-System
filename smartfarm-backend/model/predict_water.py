import json
import sys
from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).with_name("water_prediction_model.pkl")
LUX_TO_UMOL_FACTOR = 54


def build_features(model, payload):
    lux = float(payload["light_lux"])
    light_umol = lux / LUX_TO_UMOL_FACTOR

    values = {
        "day": int(payload["day"]),
        "crop": payload["crop"],
        "soil_moisture": float(payload["soil_moisture"]),
        "co2_ppm": float(payload["co2_ppm"]),
        "light_lux": lux,
        "light_umol": light_umol,
        "humidity": float(payload["humidity"]),
        "temperature": float(payload["temperature"]),
    }

    row = {}

    for feature_name in model.feature_names_in_:
        normalized = feature_name.lower()

        if feature_name == "Day":
            row[feature_name] = values["day"]
        elif feature_name == "Crop":
            row[feature_name] = values["crop"]
        elif "soil_moisture" in normalized:
            row[feature_name] = values["soil_moisture"]
        elif "co2" in normalized:
            row[feature_name] = values["co2_ppm"]
        elif "light_intensity" in normalized and "lux" in normalized:
            row[feature_name] = values["light_lux"]
        elif "light_intensity" in normalized:
            row[feature_name] = values["light_umol"]
        elif "humidity" in normalized:
            row[feature_name] = values["humidity"]
        elif "temperature" in normalized:
            row[feature_name] = values["temperature"]
        else:
            raise ValueError(f"No value mapping configured for feature '{feature_name}'")

    return pd.DataFrame([row]), light_umol


def main():
    if len(sys.argv) != 2:
        raise ValueError("Expected one JSON argument with prediction inputs.")

    payload = json.loads(sys.argv[1])
    model = joblib.load(MODEL_PATH)

    crop = payload["crop"]
    crop_encoder = (
        model.named_steps["preprocessor"]
        .named_transformers_["cat"]
    )
    crop_encoder.handle_unknown = "ignore"
    allowed_crops = set(
        crop_encoder.categories_[0].tolist()
    )

    features, light_umol = build_features(model, payload)
    prediction = float(model.predict(features)[0])

    print(
        json.dumps(
            {
                "prediction": prediction,
                "derived": {
                    "light_umol_m2_s": light_umol,
                    "lux_to_umol_factor": LUX_TO_UMOL_FACTOR,
                    "crop_seen_during_training": crop in allowed_crops,
                },
            }
        )
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(json.dumps({"error": str(error)}), file=sys.stderr)
        sys.exit(1)
