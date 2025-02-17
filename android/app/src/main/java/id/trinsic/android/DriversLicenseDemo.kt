package id.trinsic.android

import android.util.Log
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import trinsic.services.TrinsicService
import trinsic.services.account.v1.LoginRequest
import trinsic.services.account.v1.LoginResponse
import trinsic.services.universalwallet.v1.SearchRequest
import trinsic.services.verifiablecredentials.v1.CreateProofRequest
import trinsic.services.verifiablecredentials.v1.SendRequest
import java.lang.reflect.Type

class DriversLicenseDemo {
    val service = TrinsicService(null)

    private lateinit var profile: LoginResponse
    public lateinit var authToken: String

    fun login(email: String) {
        profile = service.account().login(
            LoginRequest.newBuilder().setEmail(email).setEcosystemId("default").build()
        ).get()
        Log.d("Login", "Login started, check email for code")
    }

    fun loginConfirm(code: String) {
        authToken = service.account().loginConfirm(profile.challenge, code).get()
        Log.d("Login", "Login complete, account unprotected")
        service.setAuthToken(authToken)
    }

    @Throws(JSONException::class)
    fun JSONObject.toMap(): Map<String, Any> {
        val map = mutableMapOf<String, Any>()
        val keysItr: Iterator<String> = this.keys()
        while (keysItr.hasNext()) {
            val key = keysItr.next()
            var value: Any = this.get(key)
            when (value) {
                is JSONArray -> value = value.toList()
                is JSONObject -> value = value.toMap()
            }
            map[key] = value
        }
        return map
    }

    @Throws(JSONException::class)
    fun JSONArray.toList(): List<Any> {
        val list = mutableListOf<Any>()
        for (i in 0 until this.length()) {
            var value: Any = this[i]
            when (value) {
                is JSONArray -> value = value.toList()
                is JSONObject -> value = value.toMap()
            }
            list.add(value)
        }
        return list
    }
}