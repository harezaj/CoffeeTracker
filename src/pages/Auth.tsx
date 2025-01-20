import { useEffect } from "react";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-light dark:bg-[#121212] p-4">
      <div className="flex items-center gap-4 mb-8 group">
        <div className="relative">
          <Coffee className="h-12 w-12 text-coffee dark:text-white scale-x-[-1] transform transition-transform group-hover:scale-x-[-1.1] group-hover:scale-y-[1.1]" />
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-coffee dark:bg-white rounded-full opacity-0 group-hover:animate-[droplet_1s_ease-in-out_infinite]" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-4xl font-black text-coffee-dark dark:text-white tracking-tight group-hover:text-coffee dark:group-hover:text-gray-300 transition-colors">
            Coffee Bean
          </h1>
          <span className="text-xl font-light text-coffee-dark dark:text-gray-400 tracking-wider group-hover:text-coffee dark:group-hover:text-gray-500 transition-colors">
            Journey
          </span>
        </div>
      </div>
      <div className="w-full max-w-md bg-white dark:bg-[#171717] p-8 rounded-lg shadow-lg">
        <SupabaseAuth 
          supabaseClient={supabase} 
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#967259',
                  brandAccent: '#634832',
                  inputBackground: 'white',
                  inputText: '#333333',
                  inputBorder: '#E6D5C3',
                  inputBorderFocus: '#967259',
                  inputBorderHover: '#634832',
                  defaultButtonBackground: '#967259',
                  defaultButtonBackgroundHover: '#634832',
                  defaultButtonBorder: 'transparent',
                  defaultButtonText: 'white',
                  dividerBackground: '#E6D5C3',
                },
                space: {
                  inputPadding: '0.75rem',
                  buttonPadding: '0.75rem',
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '0.5rem',
                  buttonBorderRadius: '0.5rem',
                  inputBorderRadius: '0.5rem',
                },
              },
              dark: {
                colors: {
                  brandAccent: '#967259',
                  defaultButtonBackground: '#967259',
                  defaultButtonBackgroundHover: '#634832',
                  inputBackground: '#1a1a1a',
                  inputBorder: '#333333',
                  inputBorderFocus: '#967259',
                  inputBorderHover: '#634832',
                  inputText: '#ffffff',
                }
              }
            },
            style: {
              button: {
                fontWeight: '500',
              },
              anchor: {
                color: '#967259',
                textDecoration: 'none',
              },
              message: {
                color: '#967259',
              },
            },
          }}
          providers={[]}
        />
      </div>
    </div>
  );
}