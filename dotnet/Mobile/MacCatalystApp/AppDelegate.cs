using Trinsic;

namespace MacCatalystApp;

[Register ("AppDelegate")]
public class AppDelegate : UIApplicationDelegate {
	public override UIWindow? Window {
		get;
		set;
	}

	public override bool FinishedLaunching (UIApplication application, NSDictionary launchOptions)
	{
		// create a new window instance based on the screen size
		Window = new UIWindow (UIScreen.MainScreen.Bounds);

		// create a UIViewController with a single UILabel
		var vc = new UIViewController ();
		vc.View!.AddSubview (new UILabel (Window!.Frame) {
			BackgroundColor = UIColor.White,
			TextAlignment = UITextAlignment.Center,
			Text = "Hello, Catalyst!"
		});
		Window.RootViewController = vc;

		// make the window visible
		Window.MakeKeyAndVisible ();

		SignIn();

		return true;
	}

	private static async void SignIn()
	{
		var accountService = new AccountService();
        var authToken = await accountService.LoginAnonymousAsync();

        Console.WriteLine($"AuthToken: {authToken}");

        var walletService = new WalletService();
        var items = await walletService.SearchAsync(new());

        Console.WriteLine($"Items: {items}");
	}
}
