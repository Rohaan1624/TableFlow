import { Footer } from "#components/footer";
import { Header } from "#components/header";
import { LoginForm } from "#components/loginForm";
import { SignUpForm } from "#components/signupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger } from "#components/ui/tabs";


export function AuthPage(){
    return(<>
        <Header></Header>
       
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Card className="border-border bg-card shadow-2xl shadow-black/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold text-foreground">
                Welcome to TableFlow
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your restaurant with ease
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted ">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
                  >
                    Log In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:!bg-primary data-[state=active]:!text-primary-foreground"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="mt-0">
                  <LoginForm />
                </TabsContent>

                <TabsContent value="signup" className="mt-0">
                  <SignUpForm />
                </TabsContent>

                {/* Signup Tab */}
                
              </Tabs>
            </CardContent>
          </Card>
          <Footer></Footer>
          </div>
        </main>
        
    </>
        
    )
}