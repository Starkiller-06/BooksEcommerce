import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import CardSwap, { Card } from '@/components/CardSwap';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <header className="w-full fixed top-0 z-50 bg-primary">
                <nav className="flex w-full justify-between items-center p-4">
                    <p className="text-white text-2xl font-bold">Eterna</p>
                    <div className="flex gap-6">
                    <a href="#" className="text-white hover:underline">About Us</a>
                    <a href="#" className="text-white hover:underline">Services</a>
                    </div>
                </nav>
            </header>

            <div className="bg-background w-full flex min-h-screen flex-col justify-center text-[#1b1b18] overflow-y-hidden">                
                <div className="flex w-full flex-col items-start justify-center">                
                    
                    
                    <main className="flex w-[80%] flex-row items-center justify-start gap-12">



                        <section className="flex flex-col w-full max-w-[550px] space-y-6 ml-36 justify-center self-center">
                            <div>
                                <h1 className="text-primary font-montecarlo text-[5.5rem]">Welcome</h1>
                                <p className="text-foreground">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis bibendum tellus nibh, lacinia dictum mi vestibulum a. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent posuere odio ut metus porta, a ornare purus tempor. Nam nec lorem ut velit finibus congue. Nunc elementum in arcu a eleifend.</p>
                            </div>        
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-sm border  px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a]"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="inline-block rounded-sm border border-foreground px-5 py-1.5 text-sm leading-normal text-foreground hover:bg-[#F2DBD0] transition-colors duration-300"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="inline-block rounded-sm border border-foreground px-5 py-1.5 text-sm leading-normal text-foreground hover:bg-[#F2DBD0] transition-colors duration-300"
                                            >
                                                Register
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>

                        <section className="flex-1 relative flex justify-end -top-11"
                        style={{ height: 600 }}>
                            <CardSwap
                                cardDistance={60}
                                verticalDistance={70}
                                delay={4000}
                                pauseOnHover={false}
                                width={400} 
                                height={600}
                            >
                                <Card className="overflow-hidden">
                                    <img
                                        src="./dorian_gray.jpg"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </Card>
                                <Card className="overflow-hidden">
                                    <img
                                        src="./no_longer_human.jpg"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </Card>
                                <Card className="overflow-hidden">
                                    <img
                                        src="./pride_and_prejudice.jpg"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </Card>
                                <Card className="overflow-hidden">
                                    <img
                                        src="./odyssey.jpg"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </Card>
                            </CardSwap>
                        </section>
                    </main>

                </div>
            </div>
        </>
    );
}
